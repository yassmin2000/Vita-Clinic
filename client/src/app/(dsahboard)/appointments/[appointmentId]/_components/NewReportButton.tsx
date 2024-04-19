'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Modal from '@/components/Modal';
import CreateReportForm from './CreateReportForm';

export default function NewReportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="mr-1" />
        New report
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="h-fit px-6 py-8"
      >
        <CreateReportForm onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
