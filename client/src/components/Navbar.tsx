'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';

import UserButton from './UserButton';
import ModeToggle from './ModeToggle';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import MobileSidebar from './MobileSidebar';

const poppins = Poppins({
  weight: '600',
  subsets: ['latin'],
});

interface NavbarProps {
  role: string;
}

export default function Navbar({ role }: NavbarProps) {
  const { data: session } = useSession();

  useEffect(() => {
    if (
      session &&
      session?.error &&
      session.error === 'RefreshAccessTokenError'
    ) {
      signOut();
    }

    return () => {};
  }, [session]);

  return (
    <div className="fixed z-50 flex h-16 w-full items-center justify-between border-b border-primary/10 bg-secondary px-4 py-2">
      <div className="flex items-center">
        {session && <MobileSidebar role={role} />}
        <Link href="/">
          <p
            className={cn(
              'text-3xl font-bold text-zinc-900 dark:text-gray-100',
              poppins.className
            )}
          >
            Vita Clinic
          </p>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        <ModeToggle />
        {session?.user && (
          <UserButton
            user={{
              name: `${session.user.firstName} ${session.user.lastName}`,
              email: session.user.email,
              image: session.user.avatarURL,
            }}
          />
        )}
      </div>
    </div>
  );
}
