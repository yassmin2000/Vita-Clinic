'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Info, Pencil, Plus } from 'lucide-react';

import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Modal from '../Modal';
import { Separator } from '../ui/separator';

import useUserRole from '@/hooks/useUserRole';
import type { Treatment } from '@/types/appointments.type';

interface TreatmentItemProps {
  treatment: Treatment;
}

export default function TreatmentItem({ treatment }: TreatmentItemProps) {
  const { role } = useUserRole();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <Card className="col-span-1 divide-y divide-accent rounded-lg transition-all hover:shadow-lg dark:shadow-white/10">
      <div className="truncate px-4 pt-6">
        <div className="flex flex-col gap-0.5">
          <h3 className="truncate text-lg font-medium">
            {treatment.name} - {treatment.therapy.name}
          </h3>
          <span className="mt-0.5 truncate">
            Dosage: {treatment.dosage} {treatment.therapy.unit} for{' '}
            {treatment.duration} Cycles
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-6 px-6 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {format(new Date(treatment.createdAt), 'dd MMM yyyy')}
        </div>
        <span />

        <div className="flex gap-1">
          {role && role === 'doctor' && (
            <Button size="sm">
              <Pencil className="h-4 w-4 sm:mr-2" />
              <span className="sr-only sm:not-sr-only">Edit</span>
            </Button>
          )}
          <Button size="sm" onClick={() => setIsDetailsOpen(true)}>
            <Info className="h-4 w-4 sm:mr-2" />
            <span className="sr-only sm:not-sr-only">Details</span>
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        className="h-fit md:overflow-y-auto"
      >
        <div className="space-y-6 px-4 py-2 text-foreground">
          <div className="w-full space-y-2">
            <div>
              <h3 className="text-lg font-medium">Treatment Details</h3>
              <p className="text-sm text-muted-foreground">
                Details of the treatment.
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">Treatment Name</p>
              <p>{treatment.name}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">Treatment Therapy</p>
              <p>{treatment.therapy.name}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">Treatment Dosage</p>
              <p>
                {treatment.dosage} {treatment.therapy.unit} for{' '}
                {treatment.duration} Cycles
              </p>
            </div>

            {treatment.therapy.description && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Therapy Description</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: treatment.therapy.description.replace(
                      /\n/g,
                      '<br />'
                    ),
                  }}
                />
              </div>
            )}

            {treatment.notes && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Additional Notes</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: treatment.notes.replace(/\n/g, '<br />'),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </Card>
  );
}
