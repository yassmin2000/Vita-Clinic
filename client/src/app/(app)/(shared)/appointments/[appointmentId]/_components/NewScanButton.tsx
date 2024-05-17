'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Modal from '@/components/Modal';
import ScanForm from './ScanForm';

interface NewScanButtonProps {
  appointmentId: string;
}

export default function NewScanButton({ appointmentId }: NewScanButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="mr-1" />
        New Scan
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="h-fit px-4 py-8"
      >
        <ScanForm
          appointmentId={appointmentId}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}
