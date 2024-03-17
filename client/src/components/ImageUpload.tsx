'use client';

import { useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: any;
  onChange: (file: File) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  disabled,
}: ImageUploadProps) {
  const [image, setImage] = useState(value || '/placeholder.svg');

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof window === 'undefined') {
      return;
    }

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        id="upload-button"
        disabled={disabled}
      />
      <label
        htmlFor="upload-button"
        className={cn(
          'flex flex-col items-center justify-center space-y-2 rounded-lg border-4 border-dashed border-primary/10 p-4 transition hover:opacity-75',
          !disabled && 'cursor-pointer'
        )}
      >
        <div className="relative h-40 w-40">
          <Image
            fill
            alt="Upload"
            src={image}
            className="rounded-lg object-cover"
          />
        </div>
      </label>
    </div>
  );
}
