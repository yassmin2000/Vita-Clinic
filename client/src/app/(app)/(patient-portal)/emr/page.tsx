import { redirect } from 'next/navigation';

import EmrAccordions from '@/app/(app)/(dsahboard)/patients/[patientId]/emr/edit/_components/EmrAccordions';
import { getAuthSession } from '@/lib/auth';

export default async function PatientEmrPage() {
  const session = await getAuthSession();

  if (!session) {
    return redirect('/');
  }

  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            View Your EMR
          </h2>
          <h3 className="text-base text-muted-foreground">
            View your electronic medical record.
          </h3>
        </div>

        <EmrAccordions patientId={session.user.id} view />
      </div>
    </section>
  );
}
