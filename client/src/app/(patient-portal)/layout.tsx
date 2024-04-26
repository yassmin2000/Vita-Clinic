import { redirect } from 'next/navigation';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { getAuthSession, getUserRole } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();
  const { role } = await getUserRole();

  if (!session) {
    return redirect('/sign-in');
  }

  if (role !== 'patient') {
    return redirect('/');
  }

  return (
    <div className="h-full">
      <Navbar />
      <div className="fixed inset-y-0 z-50 mt-16 hidden w-16 flex-col md:flex">
        <Sidebar />
      </div>
      <main className="h-full pt-16 md:pl-16">
        <div className="h-full space-y-2 px-4">{children}</div>
      </main>
    </div>
  );
}
