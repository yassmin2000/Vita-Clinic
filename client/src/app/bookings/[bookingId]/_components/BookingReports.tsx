'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Plus, Trash } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReportItemSkeleton from './ReportItemSkeleton';

const reportsData = [
  {
    id: 1,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 2,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 3,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 4,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 5,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 6,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 7,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 8,
    name: 'Report name',
    fileName: 'report-file-name.pdf',

    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 9,
    name: 'Report name',
    fileName: 'report-file-name.pdf',

    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 10,
    name: 'Report name',
    fileName: 'report-file-name.pdf',

    date: '2024-03-16T18:04:33.256Z',
  },
];

interface BookingReportsProps {
  id: string;
}

export default function BookingReports({ id }: BookingReportsProps) {
  const { data: reports, isLoading } = useQuery({
    queryKey: [`reports_${id}`],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return reportsData;
    },
  });

  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-primary">
          Booking Reports
        </span>

        <Button size="sm">
          <Plus className="mr-1" />
          New report
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 divide-y divide-accent md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ReportItemSkeleton key={index} />
          ))}
        {reports &&
          reports.length > 0 &&
          reports.map((report) => (
            <Card
              key={report.id}
              className="col-span-1 divide-y divide-accent rounded-lg transition-all hover:shadow-lg dark:shadow-white/10"
            >
              <Link
                href={`/report/${report.id}`}
                className="flex flex-col gap-2"
              >
                <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                  <div className="flex-1 truncate">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="truncate text-lg font-medium text-zinc-900 dark:text-gray-100">
                        {report.name}
                      </h3>
                      <h4 className="truncate text-sm font-medium text-muted-foreground">
                        {report.fileName}
                      </h4>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="mt-4 grid grid-cols-3 place-items-center gap-6 px-6 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {format(new Date(report.date), 'dd MMM yyyy')}
                </div>
                <span />
                <Button size="sm" variant="destructive">
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
