'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';

interface ModalProps {
  children?: React.ReactNode;
}

export default function Modal({ children }: ModalProps) {
  const router = useRouter();

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="h-[80%] max-w-2xl">
        <DialogDescription className="overflow-y-auto">
          {children}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
