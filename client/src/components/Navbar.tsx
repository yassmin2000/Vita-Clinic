'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';
import { useTheme } from 'next-themes';
import { Sparkle } from 'lucide-react';

import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import ModeToggle from './ModeToggle';
import UserButton from './UserButton';

const poppins = Poppins({
  weight: '600',
  subsets: ['latin'],
});

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
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
