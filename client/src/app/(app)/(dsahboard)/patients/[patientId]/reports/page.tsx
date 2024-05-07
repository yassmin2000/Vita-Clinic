import ReportsList from '@/components/ReportsList';

interface PatientReportsPageProps {
  params: {
    patientId: string;
  };
}

export default async function PatientReportsPage({
  params: { patientId },
}: PatientReportsPageProps) {
  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Reports
          </h2>
          <h3 className="text-base text-muted-foreground">
            View all patient&apos;s reports here
          </h3>
        </div>

        <ReportsList patientId={patientId} />
      </div>
    </section>
  );
}
