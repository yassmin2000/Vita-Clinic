import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';

import { pinecone } from '@/lib/pinecone';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } }).onUploadComplete(
    async ({ file }) => {
      return { url: file.url };
    }
  ),
  pdfUploader: f({ pdf: { maxFileSize: '16MB' } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log(file.url);
      console.log(file.customId);
      try {
        console.log('Start processing the file');
        const response = await fetch(file.url);
        const blob = await response.blob();

        console.log('Start loading the file');
        const loader = new PDFLoader(blob);

        const pageLevelDocs = await loader.load();

        const pineconeIndex = pinecone.index('vita-clinic');
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
        });

        console.log('Start indexing the file');
        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          // Replace later to the id of the file in the database
          namespace: 'XXYYZZEEWW',
        });

        console.log('Finish indexing the file');
        // Update the file's status in the database to 'PROCESSED' via an API call
      } catch (error) {
        // Update the file's status in the database to 'FAILED' via an API call
      }
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
