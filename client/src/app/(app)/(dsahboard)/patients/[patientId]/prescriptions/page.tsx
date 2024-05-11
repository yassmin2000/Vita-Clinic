import PrescriptionsList from '@/components/lists/PrescriptionsList';

interface PatientPrescriptionsProps {
  params: {
    patientId: string;
  };
}

export default async function PatientPrescriptions({
  params: { patientId },
}: PatientPrescriptionsProps) {
  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Prescriptions
          </h2>
          <h3 className="text-base text-muted-foreground">
            View all patient&apos;s prescriptions here
          </h3>
        </div>

        <PrescriptionsList patientId={patientId} />
      </div>
    </section>
  );
}
