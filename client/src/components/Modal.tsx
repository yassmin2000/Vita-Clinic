'use client';

import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { Drawer, DrawerContent, DrawerDescription } from './ui/drawer';

import { useMediaQuery } from '@/hooks/useMediaQuery';
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
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={onClose ? onClose : () => router.back()}
      >
        <DialogContent
          className={cn('h-[80%] max-h-[95%] max-w-2xl px-2', className)}
        >
          <DialogDescription className="overflow-y-auto">
            {children}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (onClose) {
            onClose();
          } else {
            router.back();
          }
        }
      }}
    >
      <DrawerContent className={cn('h-[80%] w-full p-2', className)}>
        <DrawerDescription className="overflow-y-auto">
          {children}
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
}
