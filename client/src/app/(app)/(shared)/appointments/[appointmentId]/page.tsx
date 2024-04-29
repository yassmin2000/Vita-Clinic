import AppointmentDetailsLayout from './_components/AppointmentDetailsLayout';

interface AppointmentPageProps {
  params: {
    appointmentId: string;
  };
}

export default function AppointmentPage({
  params: { appointmentId },
}: AppointmentPageProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      <AppointmentDetailsLayout appointmentId={appointmentId} />
    </section>
  );
}
