import TestResultsList from '@/components/lists/TestResultsList';

interface PatientTestResultsPageProps {
  params: {
    patientId: string;
  };
}

export default async function PatientTestResultsPage({
  params: { patientId },
}: PatientTestResultsPageProps) {
  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Laboratory Test Results
          </h2>
          <h3 className="text-base text-muted-foreground">
            View all patient&apos;s laboratory test results here
          </h3>
        </div>

        <TestResultsList patientId={patientId} />
      </div>
    </section>
  );
}
