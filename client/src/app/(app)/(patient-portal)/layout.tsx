import { redirect } from 'next/navigation';

import { getAuthSession, getUserRole } from '@/lib/auth';

export default async function PatientPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();
  const { role } = await getUserRole();

  if (!session || !role) {
    return redirect('/sign-in');
  }

  if (role !== 'patient') {
    return redirect('/');
  }

  return <>{children}</>;
}
