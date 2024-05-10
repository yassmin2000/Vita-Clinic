import TreatmentsList from '@/components/TreatmentsList';

interface PatientTreatmentsProps {
  params: {
    patientId: string;
  };
}

export default async function PatientTreatments({
  params: { patientId },
}: PatientTreatmentsProps) {
  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Treatments
          </h2>
          <h3 className="text-base text-muted-foreground">
            View all patient&apos;s treatments here
          </h3>
        </div>

        <TreatmentsList patientId={patientId} />
      </div>
    </section>
  );
}
