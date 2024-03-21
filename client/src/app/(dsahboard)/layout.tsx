import { redirect } from 'next/navigation';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { getAuthSession } from '@/lib/auth';

export default async function DashboardLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await getAuthSession();

  if (!session) {
    return redirect('/sign-in');
  }

  return (
    <div className="h-full">
      {modal}
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
