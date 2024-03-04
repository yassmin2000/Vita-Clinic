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
    <div className="space-y-4 flex flex-col h-full text-primary bg-secondary overflow-y-auto border-r border-primary/10">
      <div className="p-3 flex flex-1 justify-center">
        <div className="space-y-2">
          {routes.map((route) => (
            <TooltipProvider key={route.href}>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={cn(
                      'text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
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
