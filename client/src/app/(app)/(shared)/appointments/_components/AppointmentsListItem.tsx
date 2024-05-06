'use client';

import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import {
  ArrowRight,
  Check,
  CheckCheck,
  CircleOff,
  Timer,
  X,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import AppointmentDropdownMenu from './AppointmentDropdownMenu';
import { buttonVariants } from '@/components/ui/button';

import useUserRole from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';

import type { AppointmentStatus } from '@/types/appointments.type';

interface AppointmentsListItemProps {
  id: string;
  appointmentNumber: number;
  patientName: string;
  doctorName: string;
  status: AppointmentStatus;
  bookedAt: string;
  appointmentDate: string;
  cancelledAt: string;
  queryKey?: string;
}

const appointmentStatus = {
  cancelled: {
    icon: X,
    textColor: 'text-red-800',
    backgroundColor: 'bg-red-800/10',
  },
  completed: {
    icon: CheckCheck,
    textColor: 'text-green-700',
    backgroundColor: 'bg-green-700/10',
  },
  pending: {
    icon: Timer,
    textColor: 'text-orange-700',
    backgroundColor: 'bg-orange-700/10',
  },
  approved: {
    icon: Check,
    textColor: 'text-blue-700',
    backgroundColor: 'bg-blue-700/10',
  },
  rejected: {
    icon: CircleOff,
    textColor: 'text-yellow-700',
    backgroundColor: 'bg-yellow-700/10',
  },
};

export default function AppointmentsListItem({
  id,
  appointmentNumber,
  patientName,
  doctorName,
  status,
  bookedAt,
  appointmentDate,
  cancelledAt,
  queryKey,
}: AppointmentsListItemProps) {
  const { role } = useUserRole();
  const currentStatus = appointmentStatus[status];

  return (
    <Card
      key={id}
      className="flex items-center justify-between border-black/5 p-4 transition-all dark:border-gray-800"
    >
      <div className="flex items-center gap-x-4">
        <div
          className={cn('w-fit rounded-md p-2', currentStatus.backgroundColor)}
        >
          <currentStatus.icon
            className={cn('h-8 w-8', currentStatus.textColor)}
          />
        </div>
        <div className="flex flex-col">
          <p className="font-medium">
            Appointment by{' '}
            <Link
              href={`/users/${patientName}`}
              className="text-primary transition-all hover:text-primary/80"
            >
              {patientName}
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Booked at {format(parseISO(bookedAt), 'MMM dd, yyyy')}
          </p>
          {status === 'pending' ||
            (status === 'approved' && (
              <p className="text-sm text-muted-foreground">
                Appointment to Dr.{' '}
                <Link
                  href={`/users/${doctorName}`}
                  className="text-primary transition-all hover:text-primary/80"
                >
                  {doctorName}
                </Link>{' '}
                on {format(parseISO(appointmentDate), 'MMM dd, yyyy - hh:mm a')}
              </p>
            ))}
          {status === 'cancelled' && (
            <p className="text-sm text-muted-foreground">
              Cancelled on {format(parseISO(cancelledAt), 'MMM dd, yyyy')},
              booked by {format(parseISO(appointmentDate), 'MMM dd, yyyy')}
            </p>
          )}
          {status === 'completed' && (
            <p className="text-sm text-muted-foreground">
              Appointment to Dr.{' '}
              <Link
                href={`/users/${doctorName}`}
                className="text-primary transition-all hover:text-primary/80"
              >
                {doctorName}
              </Link>{' '}
              on {format(parseISO(appointmentDate), 'MMM dd, yyyy')}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {role === 'admin' && (
          <AppointmentDropdownMenu
            id={id}
            appointmentNumber={appointmentNumber}
            status={status}
            queryKey={queryKey}
          />
        )}

        <Link
          href={`/appointments/${id}`}
          className={buttonVariants({
            variant: 'ghost',
          })}
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </Card>
  );
}
