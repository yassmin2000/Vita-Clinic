import EmrAccordions from './edit/_components/EmrAccordions';

interface ViewEmrPageProps {
  params: {
    patientId: string;
  };
}

export default async function ViewEmrPage({
  params: { patientId },
}: ViewEmrPageProps) {
  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            View Patient&apos;s EMR
          </h2>
          <h3 className="text-base text-muted-foreground">
            View the patient&apos;s electronic medical record.
          </h3>
        </div>

        <EmrAccordions patientId={patientId} view />
      </div>
    </section>
  );
}
