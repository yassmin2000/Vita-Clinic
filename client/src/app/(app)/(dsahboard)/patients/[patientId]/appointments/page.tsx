import AppointmentsList from '@/app/(app)/(shared)/appointments/_components/AppointmentsList';

interface PatientAppointmentsPageProps {
  params: {
    patientId: string;
  };
}

export default async function PatientAppointmentsPage({
  params: { patientId },
}: PatientAppointmentsPageProps) {
  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Appointments
          </h2>
          <h3 className="text-base text-muted-foreground">
            View all patient&apos;s appointments here
          </h3>
        </div>

        <AppointmentsList patientId={patientId} />
      </div>
    </section>
  );
}
