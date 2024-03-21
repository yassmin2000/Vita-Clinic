import { redirect } from 'next/navigation';

import Navbar from '@/components/Navbar';
import { getAuthSession } from '@/lib/auth';

export default async function AuthLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await getAuthSession();

  if (session) {
    return redirect('/');
  }

  return (
    <div className="h-full">
      <Navbar />
      <main className="h-full pt-16">{children}</main>
    </div>
  );
}
