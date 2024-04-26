'use client';

import { useQuery } from '@tanstack/react-query';

import ScanItem from '@/components/ScanItem';
import NewScanButton from './NewScanButton';
import ScanItemSkeleton from '@/components/ScanItemSkeleton';

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

        <NewScanButton />
      </div>
      <div className="grid grid-cols-1 gap-6 divide-y divide-accent md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ScanItemSkeleton key={index} />
          ))}
        {scans &&
          scans.length > 0 &&
          scans.map((scan) => (
            <ScanItem
              key={scan.id}
              id={scan.id}
              title={scan.name}
              modality={scan.modality}
              date={scan.date}
            />
          ))}
      </div>
    </div>
  );
}
