import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '16MB' } }).onUploadComplete(
    async ({ file }) => {
      return { url: file.url };
    }
  ),
  pdfUploader: f({ pdf: { maxFileSize: '128MB' } }).onUploadComplete(
    async ({ file }) => {
      return { url: file.url };
    }
  ),
  dicomUploader: f({
    blob: { maxFileSize: '512MB', maxFileCount: 5000 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
