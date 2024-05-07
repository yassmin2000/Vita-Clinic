'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Info, Plus, Trash } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Modal from '@/components/Modal';
import { Separator } from '@/components/ui/separator';

import type { PatientAllergyField } from './PatientAllergies';

interface PatientAllergyItemProps {
  allergy: PatientAllergyField;
  isEditDisabled?: boolean;
  onEdit: () => void;
  isDeleteDisabled?: boolean;
  onDelete: () => void;
  view?: boolean;
}

export default function PatientAllergyItem({
  allergy,
  isEditDisabled = false,
  onEdit,
  isDeleteDisabled = false,
  onDelete,
  view = false,
}: PatientAllergyItemProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <Card className="col-span-1 rounded-lg transition-all">
      <div className="truncate px-4 pt-6">
        <div className="flex flex-col gap-0.5">
          <h3 className="truncate text-lg font-medium">
            {allergy.allergy.name}
          </h3>
          {allergy.patientReaction && (
            <span className="mt-0.5 truncate">
              Reaction: {allergy.patientReaction}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {format(new Date(allergy.createdAt), 'dd MMM yyyy')}
        </div>

        <div className="flex flex-wrap gap-2">
          {view ? (
            <Button size="sm" onClick={() => setIsDetailsOpen(true)}>
              <Info className="mr-2 h-4 w-4" /> Details
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="secondary"
                disabled={isEditDisabled}
                onClick={onEdit}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={isDeleteDisabled}
                onClick={onDelete}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </>
          )}
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
              <h3 className="text-lg font-medium">Allergy Details</h3>
              <p className="text-sm text-muted-foreground">
                Details of the allergy.
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">Allergy</p>
              <p>{allergy.allergy.name}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">Patient Reaction</p>
              <p>{allergy.patientReaction}</p>
            </div>

            {allergy.allergy.description && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Allergy Description</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: allergy.allergy.description.replace(
                      /\n/g,
                      '<br />'
                    ),
                  }}
                />
              </div>
            )}

            {allergy.notes && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Additional Notes</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: allergy.notes.replace(/\n/g, '<br />'),
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
