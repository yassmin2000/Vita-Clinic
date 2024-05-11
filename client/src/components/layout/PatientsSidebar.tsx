'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarCheck,
  Pill,
  FileScan,
  File,
  TestTubes,
  Calendar,
  SquareUser,
  FileStack,
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Icons } from '../Icons';

import { cn } from '@/lib/utils';

const routes = [
  { icon: SquareUser, href: '/portal', label: 'Patient Portal' },
  {
    icon: FileStack,
    href: '/emr',
    label: 'Electronic Medical Record',
  },
  {
    icon: Calendar,
    href: '/schedule',
    label: 'Schedule',
  },
  {
    icon: CalendarCheck,
    href: '/appointments',
    label: 'Appointments',
  },
  {
    icon: Pill,
    href: '/prescriptions',
    label: 'Prescriptions',
  },
  {
    icon: File,
    href: '/reports',
    label: 'Reports',
  },
  {
    icon: FileScan,
    href: '/scans',
    label: 'Scans',
  },
  {
    icon: TestTubes,
    href: '/results',
    label: 'Laboratory Test Results',
  },
  {
    icon: Icons.treatment,
    href: '/treatments',
    label: 'Treatments',
  },
];

export default function PatientsSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col space-y-4 overflow-y-auto border-r border-primary/10 bg-secondary text-primary">
      <div className="flex flex-1 justify-center p-3">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-2">
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
