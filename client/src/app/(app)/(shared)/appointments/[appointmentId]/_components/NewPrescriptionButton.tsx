'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Modal from '@/components/Modal';
import PrescriptionForm from './PrescriptionForm';

interface NewPrescriptionButtonProps {
  appointmentId: string;
}

export default function NewPrescriptionButton({
  appointmentId,
}: NewPrescriptionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="mr-1" />
        New Prescription
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="h-fit max-h-[95%] px-6 py-8"
      >
        <PrescriptionForm
          appointmentId={appointmentId}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}
