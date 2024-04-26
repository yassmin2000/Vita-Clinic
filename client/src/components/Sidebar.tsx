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
  View,
  Trash2,
  Pill,
  FileScan,
  File,
  TestTubes,
  Calendar,
  SquareUser,
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { cn } from '@/lib/utils';
import useUserRole from '@/hooks/useUserRole';

const routes = [
  {
    icon: Home,
    href: '/',
    label: 'Home',
    isStaff: true,
  },
  {
    icon: CalendarCheck,
    href: '/appointments',
    label: 'Appointments',
    isStaff: true,
  },
  {
    icon: ShieldPlus,
    href: '/admins',
    label: 'Admins',
    isStaff: true,
  },
  {
    icon: ClipboardPlus,
    href: '/doctors',
    label: 'Doctors',
    isStaff: true,
  },
  {
    icon: UserIcon,
    href: '/patients',
    label: 'Patients',
    isStaff: true,
  },
  {
    icon: Cable,
    href: '/devices',
    label: 'Devices',
    isStaff: true,
  },
  {
    icon: View,
    href: '/dicom-viewer',
    label: 'DICOM Viewer',
    isStaff: true,
  },
  {
    icon: SquareUser,
    href: '/portal',
    label: 'Patient Portal',
    isPatient: true,
  },
  {
    icon: Calendar,
    href: '/portal/schedule',
    label: 'Schedule',
    isPatient: true,
  },
  {
    icon: Pill,
    href: '/portal/medications',
    label: 'Medications',
    isPatient: true,
  },
  {
    icon: File,
    href: '/portal/reports',
    label: 'Reports',
    isPatient: true,
  },
  {
    icon: FileScan,
    href: '/portal/scans',
    label: 'Scans',
    isPatient: true,
  },
  {
    icon: TestTubes,
    href: '/portal/results',
    label: 'Laboratory Test Results',
    isPatient: true,
  },
  { icon: Trash2, href: '/trash', label: 'Trash', super: true },
  { icon: Settings, href: '/settings', label: 'Settings', super: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useUserRole();

  return (
    <div className="flex h-full flex-col space-y-4 overflow-y-auto border-r border-primary/10 bg-secondary text-primary">
      <div className="flex flex-1 justify-center p-3">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            {routes
              .filter((route) => !route.super)
              .filter((route) => {
                if (role === 'patient') return route.isPatient;
                return route.isStaff;
              })
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

          {role !== 'patient' && (
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
          )}
        </div>
      </div>
    </div>
  );
}
