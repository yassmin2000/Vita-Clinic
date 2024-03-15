'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import CreateReportForm from './CreateReportForm';

export default function NewReportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button size="sm">
          <Plus className="mr-1" />
          New report
        </Button>
      </DialogTrigger>

      <DialogContent className="pb-0">
        <CreateReportForm onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
