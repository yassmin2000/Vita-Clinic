'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CloseModal() {
  const router = useRouter();

  return (
    <Button
      aria-label="close modal"
      className="h-6 w-6 p-0 rounded-md"
      onClick={() => router.back()}
      variant="secondary"
    >
      <X className="w-4 h-4" />
    </Button>
  );
}
