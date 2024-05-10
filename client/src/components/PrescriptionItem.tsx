'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Info, Pencil, Plus } from 'lucide-react';

import { Card } from './ui/card';
import { Button } from './ui/button';
import Modal from './Modal';
import { Separator } from './ui/separator';

import useUserRole from '@/hooks/useUserRole';
import { capitalize } from '@/lib/utils';

import { Prescription } from '@/types/appointments.type';

interface PrescriptionItemProps {
  prescription: Prescription;
}

export default function PrescriptionItem({
  prescription,
}: PrescriptionItemProps) {
  const { role } = useUserRole();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <Card className="col-span-1 divide-y divide-accent rounded-lg transition-all hover:shadow-lg dark:shadow-white/10">
      <div className="truncate px-4 pt-6">
        <div className="flex flex-col gap-0.5">
          <h3 className="truncate text-lg font-medium">
            {prescription.medication.name}
          </h3>
          <span className="mt-0.5 truncate">
            Dosage: {prescription.dosage} {prescription.medication.unit}{' '}
            {prescription.frequency} (
            {prescription.required ? 'Required' : 'Optional'})
          </span>
          <div className="flex items-center gap-1">
            {prescription.startDate && (
              <span className="mt-0.5 truncate">
                {format(new Date(prescription.startDate), 'dd MMM yyyy')}
              </span>
            )}
            {prescription.endDate && (
              <span className="mt-0.5 truncate">
                - {format(new Date(prescription.endDate), 'dd MMM yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-6 px-6 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {format(new Date(prescription.createdAt), 'dd MMM yyyy')}
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
              <h3 className="text-lg font-medium">Prescription Details</h3>
              <p className="text-sm text-muted-foreground">
                Details of the prescription.
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">Prescription</p>
              <p>
                {prescription.medication.name}
                {prescription.required && <span> (Required)</span>}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">Medication Dosage Form</p>
              <p>{capitalize(prescription.medication.dosageForm)}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">
                Medication Route of Administration
              </p>
              <p>{capitalize(prescription.medication.routeOfAdministration)}</p>
            </div>

            {prescription.dosage && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Dosage</p>
                <p>
                  {prescription.dosage} {prescription.medication.unit}
                </p>
              </div>
            )}

            {prescription.frequency && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Frequency</p>
                <p>{capitalize(prescription.frequency)}</p>
              </div>
            )}

            {prescription.startDate && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">
                  Medication Start Date
                </p>
                <p>{format(new Date(prescription.startDate), 'dd MMM yyyy')}</p>
              </div>
            )}

            {prescription.endDate && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Medication End Date</p>
                <p>{format(new Date(prescription.endDate), 'dd MMM yyyy')}</p>
              </div>
            )}

            {prescription.medication.description && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">
                  Medication Description
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: prescription.medication.description.replace(
                      /\n/g,
                      '<br />'
                    ),
                  }}
                />
              </div>
            )}

            {prescription.notes && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Additional Notes</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: prescription.notes.replace(/\n/g, '<br />'),
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
