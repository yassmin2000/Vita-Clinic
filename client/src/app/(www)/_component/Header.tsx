'use client';

import Link from 'next/link';
import Image from 'next/image';

import { buttonVariants } from '@/components/ui/button';

import useUserRole from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';

const links = [
  {
    title: 'Services',
    href: '#services',
  },
  {
    title: 'About Us',
    href: '#about',
  },
  {
    title: 'Testimonials',
    href: '#testimonials',
  },
  {
    title: 'Contact Us',
    href: '#contact',
  },
];

export default function Header() {
  const { role } = useUserRole();

  return (
    <header className="fixed top-0 z-[200] mx-auto flex w-full items-start justify-between self-center p-5 text-black backdrop-blur-[2px] xl:items-center">
      <Link
        href="/"
        className="hidden h-full w-52 sm:block"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <Image src="/logo-light.png" alt="Logo" width={5608} height={1024} />
      </Link>

      <Link
        href="/"
        className="relative block h-10 w-10 sm:hidden"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <Image src="/favicon-light.png" alt="Logo" fill />
      </Link>

      <div className="hidden items-center gap-4 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-semibold transition-all hover:text-primary"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(
                link.href.replace('#', '')
              );
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {link.title}
          </Link>
        ))}
        <Link href="#" className={cn(buttonVariants(), 'rounded-full')}>
          Book Now
        </Link>
      </div>

      {!role ? (
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              'rounded-full bg-gray-100 text-black hover:bg-gray-100/60'
            )}
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className={cn(buttonVariants(), 'rounded-full')}
          >
            Sign Up
          </Link>
        </div>
      ) : role === 'patient' ? (
        <Link href="/portal" className={cn(buttonVariants(), 'rounded-full')}>
          Patient Portal
        </Link>
      ) : (
        <Link
          href="/dashboard"
          className={cn(buttonVariants(), 'rounded-full')}
        >
          Dashboard
        </Link>
      )}
    </header>
  );
}
