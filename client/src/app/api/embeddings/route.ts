import { NextRequest, NextResponse } from 'next/server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';

import { pinecone } from '@/lib/pinecone';
import { getAccessToken, getUserRole } from '@/lib/auth';

import type { Report } from '@/types/appointments.type';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const accessToken = await getAccessToken();
  const { role } = await getUserRole();

  if (role !== 'doctor') {
    return new NextResponse('Unauthorized.', { status: 401 });
  }

  const { reportId } = body;

  try {
    const report = (await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json())) as Report | null;

    if (!report) {
      return new NextResponse('Report not found.', { status: 404 });
    }

    const response = await fetch(report.reportURL);
    const blob = await response.blob();

    const loader = new PDFLoader(blob);
    const pageLevelDocs = await loader.load();
    const pineconeIndex = pinecone.index('vita-clinic');

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: report.id,
    });

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}/process`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return new NextResponse('Report processed.', { status: 201 });
  } catch (error) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}/fail`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return new NextResponse('Internal server error.', { status: 500 });
  }
}
