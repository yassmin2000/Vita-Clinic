'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import NewTestResultsButton from './NewTestResultsButton';
import TestResultsItem from '@/components/lists/TestResultsItem';
import ReportItemSkeleton from '@/components/skeletons/ReportItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';

import type { TestResult } from '@/types/appointments.type';

interface AppointmentTestResultsProps {
  appointmentId: string;
}

export default function AppointmentTestResults({
  appointmentId,
}: AppointmentTestResultsProps) {
  const accessToken = useAccessToken();
  const { role } = useUserRole();

  const { data: testResults, isLoading } = useQuery({
    queryKey: [`test_results_${appointmentId}`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}/test-results`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as TestResult[];
    },
    enabled: !!accessToken,
  });

  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-primary">
          Appointment Laboard Test Results
        </span>

        {role === 'doctor' && (
          <NewTestResultsButton appointmentId={appointmentId} />
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ReportItemSkeleton key={index} />
          ))}
        {testResults &&
          testResults.length > 0 &&
          testResults.map((results) => (
            <TestResultsItem key={results.id} testResults={results} />
          ))}
      </div>
    </div>
  );
}
