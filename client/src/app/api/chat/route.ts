import { NextRequest, NextResponse } from 'next/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIStream, StreamingTextResponse } from 'ai';

import { pinecone } from '@/lib/pinecone';
import { openai } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Make sure user is authenticated and has access to use the chat

    // Validate the body
    const { fileId, message } = body;

    // Get the file messages from the database

    // Create the user message in the database

    const pineconeIndex = pinecone.index('nexus-scan');
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    const vectoreStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: fileId,
    });

    const results = await vectoreStore.similaritySearch(message, 4);

    // Format the messages from the database
    const formattedMessages: {
      role: 'user' | 'assistant';
      content: string;
    }[] = [];

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
        // Save the message to the database
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    return new Response('Message could not be sent.', { status: 500 });
  }
}
