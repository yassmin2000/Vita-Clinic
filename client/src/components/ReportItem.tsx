import Link from 'next/link';
import { format } from 'date-fns';
import { Info, Plus, Trash } from 'lucide-react';

import { Card } from './ui/card';
import { Button } from './ui/button';

import useUserRole from '@/hooks/useUserRole';

interface ReportItemProps {
  id: number;
  title: string;
  fileName: string;
  date: string;
}

export default function ReportItem({
  id,
  title,
  fileName,
  date,
}: ReportItemProps) {
  const { role } = useUserRole();

  return (
    <Card className="col-span-1 divide-y divide-accent rounded-lg transition-all hover:shadow-lg dark:shadow-white/10">
      <Link
        href={role === 'patient' ? `/portal/reports/${id}` : `/reports/${id}`}
        className="flex flex-col gap-2"
      >
        <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="flex-1 truncate">
            <div className="flex flex-col gap-0.5">
              <h3 className="truncate text-lg font-medium">{title}</h3>
              <h4 className="truncate text-sm font-medium text-muted-foreground">
                {fileName}
              </h4>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between gap-6 px-6 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {format(new Date(date), 'dd MMM yyyy')}
        </div>
        <span />

        <div className="flex gap-1">
          {role && role !== 'patient' && (
            <Button size="sm" variant="destructive">
              <Trash className="mr-2 h-4 w-4" /> Delete
            </Button>
          )}

          {role && role === 'patient' && (
            <Button size="sm">
              <Info className="mr-2 h-4 w-4" /> Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
