import { redirect } from 'next/navigation';

import ReportsList from './_components/ScansList';
import { getUserRole } from '@/lib/auth';

export default async function ScansPage() {
  const { role } = await getUserRole();

  if (role !== 'patient') {
    return redirect('/');
  }

  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Scans
          </h2>
          <h3 className="text-base text-muted-foreground">
            View all your scans here
          </h3>
        </div>

        <ReportsList />
      </div>
    </section>
  );
}
