import AppointmentsList from './_components/AppointmentsList';

export default function AppointmentsPage() {
  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Appointments
          </h2>
          <h3 className="text-base text-muted-foreground">
            View all your appointments here
          </h3>
        </div>

        <AppointmentsList />
      </div>
    </section>
  );
}
