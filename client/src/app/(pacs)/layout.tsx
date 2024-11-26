import { redirect } from 'next/navigation';

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

  return <main className="h-full">{children}</main>;
}
