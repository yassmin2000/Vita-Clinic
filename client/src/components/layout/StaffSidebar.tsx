'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardPlus,
  CalendarCheck,
  Home,
  Settings,
  ShieldPlus,
  UserIcon,
  Cable,
  Trash2,
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { cn } from '@/lib/utils';

const routes = [
  {
    icon: Home,
    href: '/dashboard',
    label: 'Home',
  },
  {
    icon: CalendarCheck,
    href: '/appointments',
    label: 'Appointments',
  },
  {
    icon: ShieldPlus,
    href: '/admins',
    label: 'Admins',
  },
  {
    icon: ClipboardPlus,
    href: '/doctors',
    label: 'Doctors',
  },
  {
    icon: UserIcon,
    href: '/patients',
    label: 'Patients',
  },
  {
    icon: Cable,
    href: '/devices',
    label: 'Devices',
  },
  { icon: Trash2, href: '/trash', label: 'Trash', super: true },
  { icon: Settings, href: '/settings', label: 'Settings', super: true },
];

export default function StaffSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col space-y-4 overflow-y-auto border-r border-primary/10 bg-secondary text-primary">
      <div className="flex flex-1 justify-center p-3">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            {routes
              .filter((route) => !route.super)
              .map((route) => (
                <TooltipProvider key={route.href}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={cn(
                          'group flex w-full cursor-pointer justify-start rounded-lg p-3 text-xs font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-primary',
                          pathname === route.href &&
                            'bg-primary/10 text-primary'
                        )}
                      >
                        <Link
                          href={route.href}
                          className="flex items-center gap-8"
                        >
                          <route.icon className="h-5 w-5" />

                          <p className="md:hidden">{route.label}</p>
                        </Link>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="start"
                      className="hidden md:block"
                    >
                      <p>{route.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>

          <div className="flex flex-col gap-2">
            {routes
              .filter((route) => route.super)
              .map((route) => (
                <TooltipProvider key={route.href}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={cn(
                          'group flex w-full cursor-pointer justify-start rounded-lg p-3 text-xs font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-primary',
                          pathname === route.href &&
                            'bg-primary/10 text-primary'
                        )}
                      >
                        <Link
                          href={route.href}
                          className="flex items-center gap-8"
                        >
                          <route.icon className="h-5 w-5" />
                          <p className="md:hidden">{route.label}</p>
                        </Link>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="start"
                      className="hidden md:block"
                    >
                      <p>{route.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
