import DoctorsTable from './_components/DoctorsTable';

export default function AdminsPage() {
  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Doctors
          </h2>
          <h3 className="text-base text-muted-foreground">
            Manage all the doctors in your organization, and add new doctors.
          </h3>
        </div>

        <DoctorsTable />
      </div>
    </section>
  );
}
