import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ArrowRight, Check, Timer, X } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AppointmentsListItemProps {
  id: number;
  patientName: string;
  doctorName: string;
  status: 'completed' | 'pending' | 'cancelled';
  bookedAt: string;
  appointmentDate: string;
  cancelledAt: string;
}

const appointmentStatus = {
  cancelled: {
    icon: X,
    textColor: 'text-red-800',
    backgroundColor: 'bg-red-800/10',
  },
  completed: {
    icon: Check,
    textColor: 'text-green-700',
    backgroundColor: 'bg-green-700/10',
  },
  pending: {
    icon: Timer,
    textColor: 'text-orange-700',
    backgroundColor: 'bg-orange-700/10',
  },
};

export default function AppointmentsListItem({
  id,
  patientName,
  doctorName,
  status,
  bookedAt,
  appointmentDate,
  cancelledAt,
}: AppointmentsListItemProps) {
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
          {status === 'pending' && (
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
      <Link href={`/appointments/${id}`}>
        <ArrowRight className="h-5 w-5" />
      </Link>
    </Card>
  );
}
