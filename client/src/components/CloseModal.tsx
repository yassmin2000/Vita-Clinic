'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CloseModal() {
  const router = useRouter();

  return (
    <Button
      aria-label="close modal"
      className="h-6 w-6 rounded-md p-0"
      onClick={() => router.back()}
      variant="secondary"
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
