import Image from 'next/image';

export default function ImageUpload() {
  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      <div className="p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
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
