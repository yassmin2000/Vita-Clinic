'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import UserButton from './UserButton';
import ModeToggle from './ModeToggle';
import { signOut, useSession } from 'next-auth/react';
import MobileSidebar from './MobileSidebar';

interface NavbarProps {
  role: string;
}

export default function Navbar({ role }: NavbarProps) {
  const { resolvedTheme } = useTheme();
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
        <Link
          href={role === 'patient' ? '/portal' : '/dashboard'}
          className="hidden h-full w-52 sm:block"
        >
          <Image
            src={
              resolvedTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'
            }
            alt="Logo"
            width={5608}
            height={1024}
          />
        </Link>
        <Link
          href={role === 'patient' ? '/portal' : '/dashboard'}
          className="relative block h-10 w-10 sm:hidden"
        >
          <Image
            src={
              resolvedTheme === 'dark'
                ? '/favicon-dark.png'
                : '/favicon-light.png'
            }
            alt="Logo"
            fill
          />
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
