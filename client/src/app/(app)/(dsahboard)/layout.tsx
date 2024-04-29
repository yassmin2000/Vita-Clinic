import { redirect } from 'next/navigation';

import { getAuthSession, getUserRole } from '@/lib/auth';

export default async function DashboardLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await getAuthSession();
  const { role } = await getUserRole();

  if (!session || !role) {
    return redirect('/sign-in');
  }

  if (!role || role === 'patient') {
    return redirect('/portal');
  }

  return (
    <>
      {modal}
      {children}
    </>
  );
}
