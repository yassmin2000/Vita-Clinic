'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash } from 'lucide-react';
import { format } from 'date-fns';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ScanItemSkeleton from './ScanItemSkeleton';

const scansData = [
  {
    id: 1,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'CT',
  },
  {
    id: 2,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'MRI',
  },
  {
    id: 3,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'MRI',
  },
  {
    id: 4,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'X-Ray',
  },
  {
    id: 5,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'PET',
  },
  {
    id: 6,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'PET',
  },
  {
    id: 7,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'MRI',
  },
  {
    id: 8,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'MRI',
  },
];

interface AppointmentScansProps {
  id: string;
}

export default function AppointmentScans({ id }: AppointmentScansProps) {
  const { data: scans, isLoading } = useQuery({
    queryKey: [`scans_${id}`],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return scansData;
    },
  });

  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-primary">
          Appointment Scans
        </span>

        <Button size="sm">
          <Plus className="mr-1" />
          New Scan
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 divide-y divide-accent md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ScanItemSkeleton key={index} />
          ))}
        {scans &&
          scans.length > 0 &&
          scans.map((scan) => (
            <Card
              key={scan.id}
              className="col-span-1 divide-y divide-accent rounded-lg transition-all hover:shadow-lg dark:shadow-white/10"
            >
              <Link href={`/scan/${scan.id}`} className="flex flex-col gap-2">
                <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                  <div className="flex-1 truncate">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="truncate text-lg font-medium text-zinc-900 dark:text-gray-100">
                        {scan.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="mt-4 grid grid-cols-3 place-items-center gap-6 px-6 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {format(new Date(scan.date), 'dd MMM yyyy')}
                </div>
                <span>{scan.modality}</span>
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
