'use client';

import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
}: ModalProps) {
  const router = useRouter();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose ? onClose : () => router.back()}
    >
      <DialogContent className={cn('h-[80%] max-w-2xl px-2', className)}>
        <DialogDescription className="overflow-y-auto">
          {children}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
