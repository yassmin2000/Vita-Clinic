'use client';

import { usePathname } from 'next/navigation';
import { CalendarCheck, Home, Plus, Settings, ShieldPlus } from 'lucide-react';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

const routes = [
  {
    icon: Home,
    href: '/',
    label: 'Home',
  },
  {
    icon: CalendarCheck,
    href: '/bookings',
    label: 'Bookings',
  },
  {
    icon: ShieldPlus,
    href: '/admins',
    label: 'Admins',
  },
  {
    icon: Plus,
    href: '/doctors',
    label: 'Doctors',
  },
  {
    icon: Plus,
    href: '/patients',
    label: 'Patients',
  },
  {
    icon: Plus,
    href: '/devices',
    label: 'Devices',
  },
  {
    icon: Plus,
    href: '/viewier',
    label: 'DICOM Viewer',
  },
  { icon: Settings, href: '/settings', label: 'Settings', pro: false },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col space-y-4 overflow-y-auto border-r border-primary/10 bg-secondary text-primary">
      <div className="flex flex-1 justify-center p-3">
        <div className="space-y-2">
          {routes.map((route) => (
            <TooltipProvider key={route.href}>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={cn(
                      'group flex w-full cursor-pointer justify-start rounded-lg p-3 text-xs font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-primary',
                      pathname === route.href && 'bg-primary/10 text-primary'
                    )}
                  >
                    <Link href={route.href}>
                      <route.icon className="h-5 w-5" />
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" align="start">
                  <p>{route.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}
