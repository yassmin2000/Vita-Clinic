import { redirect } from 'next/navigation';

import StaffSidebar from '@/components/layout/StaffSidebar';
import PatientsSidebar from '@/components/layout/PatientsSidebar';
import Navbar from '@/components/layout/Navbar';
import { getAuthSession, getUserRole } from '@/lib/auth';

export default async function PacsLayout({
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
      {/* <Navbar role={role} /> */}
      <main className="h-full">{children}</main>
    </div>
  );
}
