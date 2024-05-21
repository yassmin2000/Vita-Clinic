import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  return (
    <div className="h-full sm:h-[90%]">
      <div className="flex h-full w-full items-center justify-start bg-[url(/hero-mobile.jpg)] bg-cover bg-center bg-no-repeat sm:bg-[url(/hero.jpg)]">
        <div className="w-[90%] px-4 md:ml-28 md:max-w-[40%]">
          <h1 className="text-6xl font-bold text-primary sm:text-zinc-800">
            Welcome to <span className="text-primary">Vita Clinic</span>
          </h1>
          <p className="mt-2 text-lg text-zinc-800">
            Vita Clinic offers comprehensive oncology care with versatile EMR
            solutions, dedicated to enhancing patient health and well-being
            through cutting-edge treatments and compassionate support.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                'rounded-full'
              )}
            >
              Learn More
            </Link>

            <Link href="#" className={cn(buttonVariants(), 'rounded-full')}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
