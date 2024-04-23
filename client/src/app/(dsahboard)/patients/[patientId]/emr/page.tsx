import EditEmrAccordions from './_components/EditEmrAccordions';

interface EditEMRPageProps {
  params: {
    patientId: string;
  };
}

export default function EditEMRPage({
  params: { patientId },
}: EditEMRPageProps) {
  return (
    <section className="container mx-auto px-1 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Edit Patient&apos;s EMR
          </h2>
          <h3 className="text-base text-muted-foreground">
            Edit the patient&apos;s electronic medical record.
          </h3>
        </div>

        <EditEmrAccordions patientId={patientId} />
      </div>
    </section>
  );
}
