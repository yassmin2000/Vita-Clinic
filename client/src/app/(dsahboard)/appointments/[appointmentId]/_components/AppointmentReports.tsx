'use client';

import { useQuery } from '@tanstack/react-query';

import ReportItem from '@/components/ReportItem';
import NewReportButton from './NewReportButton';
import ReportItemSkeleton from '@/components/ReportItemSkeleton';

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

interface AppointmentReportsProps {
  id: string;
}

export default function AppointmentReports({ id }: AppointmentReportsProps) {
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
          Appointment Reports
        </span>

        <NewReportButton />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ReportItemSkeleton key={index} />
          ))}
        {reports &&
          reports.length > 0 &&
          reports.map((report) => (
            <ReportItem
              key={report.id}
              id={report.id}
              title={report.name}
              fileName={report.fileName}
              date={report.date}
            />
          ))}
      </div>
    </div>
  );
}
