'use client';

import Link from 'next/link';
import Image from 'next/image';

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

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="h-full w-52"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Image
              src="/logo-light.png"
              alt="Logo"
              width={5608}
              height={1024}
            />
          </Link>

          <div className="-mx-4 mt-6 flex flex-wrap justify-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mx-4 text-sm text-gray-600 transition-colors duration-300 hover:text-primary"
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
          </div>
        </div>

        <hr className="my-6 border-gray-200 md:my-10" />

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-500">
            © Copyright {new Date().getFullYear().toString()}. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
