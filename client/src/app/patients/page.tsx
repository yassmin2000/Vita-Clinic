import PatientsTable from './_components/PatientsTable';

export default function PatientsPage() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Patients
          </h2>
          <h3 className="text-base text-muted-foreground">
            Manage all the patients in your organization, and add new patients.
          </h3>
        </div>

        <PatientsTable />
      </div>
    </section>
  );
}
