import { NextRequest, NextResponse } from 'next/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIStream, StreamingTextResponse } from 'ai';

import { pinecone } from '@/lib/pinecone';
import { openai } from '@/lib/openai';
import { getAccessToken, getUserRole } from '@/lib/auth';

import type { Message } from '@/types/appointments.type';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const acceesToken = await getAccessToken();
    const { role } = await getUserRole();

    if (!role || role !== 'doctor') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { fileId, message } = body;

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reports/${fileId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${acceesToken}`,
        },
        body: JSON.stringify({
          message,
          isUserMessage: true,
        }),
      }
    );

    const pineconeIndex = pinecone.index('vita-clinic');
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    const vectoreStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: fileId,
    });

    const results = await vectoreStore.similaritySearch(message, 4);

    const prevMessages = (await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reports/${fileId}/messages`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${acceesToken}`,
        },
      }
    ).then((res) => res.json())) as Message[];

    const formattedMessages = prevMessages.map((message) => ({
      role: message.isUserMessage ? ('user' as const) : ('assistant' as const),
      content: message.message,
    }));

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      stream: true,
      messages: [
        {
          role: 'system',
          content:
            'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
        },
        {
          role: 'user',
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
            \n----------------\n
            PREVIOUS CONVERSATION:
            ${formattedMessages.map((message) => {
              if (message.role === 'user') return `User: ${message.content}\n`;
              return `Assistant: ${message.content}\n`;
            })}
            \n----------------\n
            CONTEXT:
            ${results.map((r) => r.pageContent).join('\n\n')}
            USER INPUT: ${message}
          `,
        },
      ],
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reports/${fileId}/messages`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${acceesToken}`,
            },
            body: JSON.stringify({
              message: completion,
              isUserMessage: false,
            }),
          }
        );
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    return new Response('Message could not be sent.', { status: 500 });
  }
}
