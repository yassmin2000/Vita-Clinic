import { format } from 'date-fns';
import { Info, Pencil, Plus } from 'lucide-react';

import { Card } from './ui/card';
import { Button } from './ui/button';

import useUserRole from '@/hooks/useUserRole';

interface TreatmentItemProps {
  id: string;
  title: string;
  therapyName: string;
  therapyUnit?: string;
  treatmentDosage: number;
  treatmentDuration: number;
  date: string;
}

export default function TreatmentItem({
  id,
  title,
  therapyName,
  therapyUnit,
  treatmentDosage,
  treatmentDuration,
  date,
}: TreatmentItemProps) {
  const { role } = useUserRole();

  return (
    <Card
      key={id}
      className="col-span-1 divide-y divide-accent rounded-lg transition-all hover:shadow-lg dark:shadow-white/10"
    >
      <div className="truncate px-4 pt-6">
        <div className="flex flex-col gap-0.5">
          <h3 className="truncate text-lg font-medium">
            {title} - {therapyName}
          </h3>
          <span className="mt-0.5 truncate">
            Dosage: {treatmentDosage} {therapyUnit} for {treatmentDuration}{' '}
            Cycles
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-6 px-6 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {format(new Date(date), 'dd MMM yyyy')}
        </div>
        <span />

        <div className="flex gap-1">
          {role && role === 'doctor' && (
            <Button size="sm">
              <Pencil className="h-4 w-4 sm:mr-2" />
              <span className="sr-only sm:not-sr-only">Edit</span>
            </Button>
          )}
          {role && role !== 'doctor' && (
            <Button size="sm">
              <Info className="h-4 w-4 sm:mr-2" />
              <span className="sr-only sm:not-sr-only">Details</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
