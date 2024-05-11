import { redirect } from 'next/navigation';

import StaffSidebar from '@/components/layout/StaffSidebar';
import PatientsSidebar from '@/components/layout/PatientsSidebar';
import Navbar from '@/components/layout/Navbar';
import { getAuthSession, getUserRole } from '@/lib/auth';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();
  const { role } = await getUserRole();

  if (!session || !role) {
    return redirect('/sign-in');
  }

  return (
    <div className="h-full">
      <Navbar role={role} />
      <div className="fixed inset-y-0 z-50 mt-16 hidden w-16 flex-col md:flex">
        {role === 'patient' ? <PatientsSidebar /> : <StaffSidebar />}
      </div>
      <main className="h-full pt-16 md:pl-16">
        <div className="h-full space-y-2 px-4">{children}</div>
      </main>
    </div>
  );
}
