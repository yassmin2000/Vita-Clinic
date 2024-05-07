import ScansList from '@/components/ScansList';

interface PatientScansProps {
  params: {
    patientId: string;
  };
}

export default async function PatientScans({
  params: { patientId },
}: PatientScansProps) {
  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Scans
          </h2>
          <h3 className="text-base text-muted-foreground">
            View all patient&apos;s scans here
          </h3>
        </div>

        <ScansList patientId={patientId} />
      </div>
    </section>
  );
}
