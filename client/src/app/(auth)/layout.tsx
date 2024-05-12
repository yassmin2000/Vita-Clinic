import { redirect } from 'next/navigation';

import Navbar from '@/components/layout/Navbar';
import { getAuthSession } from '@/lib/auth';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();

  if (session) {
    return redirect('/dashboard');
  }

  return (
    <div className="h-full">
      <Navbar role={''} />
      <main className="h-full pt-16">
        <div className="h-full space-y-2 px-4">{children}</div>
      </main>
    </div>
  );
}
