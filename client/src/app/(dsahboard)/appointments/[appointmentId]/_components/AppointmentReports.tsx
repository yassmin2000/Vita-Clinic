'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import ReportItem from '@/components/ReportItem';
import NewReportButton from './NewReportButton';
import ReportItemSkeleton from '@/components/ReportItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';

import type { Report } from '@/types/appointments.type';

interface AppointmentReportsProps {
  appointmentId: string;
}

export default function AppointmentReports({
  appointmentId,
}: AppointmentReportsProps) {
  const accessToken = useAccessToken();
  const { role } = useUserRole();

  const { data: reports, isLoading } = useQuery({
    queryKey: [`reports_${appointmentId}`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}/reports`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Report[];
    },
    enabled: !!accessToken,
  });

  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-primary">
          Appointment Reports
        </span>

        {role === 'doctor' && <NewReportButton appointmentId={appointmentId} />}
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
              title={report.title}
              fileName={report.fileName}
              date={report.createdAt}
            />
          ))}
      </div>
    </div>
  );
}
