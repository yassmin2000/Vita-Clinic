'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Modal from '@/components/Modal';
import CreateTestResultsForm from './CreateTestResultsForm';

interface NewTestResultsButtonProps {
  appointmentId: string;
}

export default function NewTestResultsButton({
  appointmentId,
}: NewTestResultsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="mr-1" />
        New Laboratory Test Results
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="h-fit overflow-y-auto px-6 py-8"
      >
        <CreateTestResultsForm
          appointmentId={appointmentId}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}
