import { Suspense } from 'react';

import AppointmentDetailsCard from './_components/AppointmentDetailsCard';
import AppointmentReports from './_components/AppointmentReports';
import AppointmentScans from './_components/AppointmentScans';
import AppointmentDetailsCardSkeleton from './_components/AppointmentDetailsCardSkeleton';
import { Separator } from '@/components/ui/separator';

interface AppointmentPageProps {
  params: {
    appointmentId: string;
  };
}

export default async function AppointmentPage({
  params: { appointmentId },
}: AppointmentPageProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <Suspense fallback={<AppointmentDetailsCardSkeleton />}>
          <AppointmentDetailsCard />
          <AppointmentReports id={appointmentId} />
          <Separator className="my-1" />
          <AppointmentScans id={appointmentId} />
        </Suspense>
      </div>
    </section>
  );
}
