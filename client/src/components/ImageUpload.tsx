import Image from 'next/image';

export default function ImageUpload() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border-4 border-dashed border-primary/10 p-4 transition hover:opacity-75">
        <div className="relative h-40 w-40">
          <Image
            fill
            alt="Upload"
            src={'/placeholder.svg'}
            className="rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
}
