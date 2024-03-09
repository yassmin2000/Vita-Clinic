'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';

import UserButton from './UserButton';
import ModeToggle from './ModeToggle';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  weight: '600',
  subsets: ['latin'],
});

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="fixed z-50 flex h-16 w-full items-center justify-between border-b border-primary/10 bg-secondary px-4 py-2">
      <div className="flex items-center">
        {/* <MobileSidebar isPro={isPro} /> */}
        <Link href="/">
          <p
            className={cn(
              'text-3xl font-bold text-zinc-900 dark:text-gray-100',
              poppins.className
            )}
          >
            Nexus Scan
          </p>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        <ModeToggle />
        <UserButton
          user={{
            name: 'Abdallah Magy',
            email: 'abdallah@gmail.com',
            image: 'https://avatars.githubusercontent.com/u/17731926?v=4',
          }}
        />
      </div>
    </div>
  );
}
