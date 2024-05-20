import { notFound } from 'next/navigation';

import LogTable from './_component/LogTable';

import { getUserRole } from '@/lib/auth';

export default async function LogPage() {
  const { isSuperAdmin } = await getUserRole();

  if (!isSuperAdmin) {
    return notFound();
  }

  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Actions Log
          </h2>
          <h3 className="text-base text-muted-foreground">
            View all the actions performed by the users in your clinic.
          </h3>
        </div>

        <LogTable />
      </div>
    </section>
  );
}
