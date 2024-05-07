'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Modal from '@/components/Modal';
import TreatmentForm from './TreatmentForm';

interface NewTreatmentButtonProps {
  appointmentId: string;
}

export default function NewTreatmentButton({
  appointmentId,
}: NewTreatmentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="mr-1" />
        New Treatment
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="px-6 py-8"
      >
        <TreatmentForm
          appointmentId={appointmentId}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}
