'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Info, Pencil, Plus } from 'lucide-react';

import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Modal from '../Modal';
import { Separator } from '../ui/separator';

import useUserRole from '@/hooks/useUserRole';
import type { Report } from '@/types/appointments.type';

interface ReportItemProps {
  report: Report;
}

export default function ReportItem({ report }: ReportItemProps) {
  const { role } = useUserRole();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <Card className="col-span-1 divide-y divide-accent rounded-lg transition-all hover:shadow-lg dark:shadow-white/10">
      <Link href={`/reports/${report.id}`} className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="flex-1 truncate">
            <div className="flex flex-col gap-0.5">
              <h3 className="truncate text-lg font-medium">{report.title}</h3>
              <h4 className="truncate text-sm font-medium text-muted-foreground">
                {report.fileName}
              </h4>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between gap-6 px-6 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {format(new Date(report.createdAt), 'dd MMM yyyy')}
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
              <h3 className="text-lg font-medium">Report Details</h3>
              <p className="text-sm text-muted-foreground">
                Details of the report.
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">Report Title</p>
              <p>{report.title}</p>
            </div>

            {report.notes && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Additional Notes</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: report.notes.replace(/\n/g, '<br />'),
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
