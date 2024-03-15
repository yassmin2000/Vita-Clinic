import Link from 'next/link';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Check, MoreVertical, Timer, X } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Appointment = {
  id: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  bookedAt: string;
  cancelledAt: string;
  status: 'completed' | 'pending' | 'cancelled';
};

const appointment: Appointment = {
  id: 1,
  patientName: 'Douglas West',
  doctorName: 'Ed Murphy',
  appointmentDate: '2024-03-16T18:04:33.256Z',
  bookedAt: '2023-02-09T16:28:55.721Z',
  cancelledAt: '2021-12-15T13:47:50.681Z',
  status: 'completed',
};

export default async function AppointmentDetailsCard() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-primary">
                Appointment #{appointment.id}
              </span>
              <Badge variant={appointment.status} className="capitalize">
                {appointment.status}
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem disabled={appointment.status === 'completed'}>
                  <Check className="mr-2 h-4 w-4" /> Mark as completed
                </DropdownMenuItem>
                <DropdownMenuItem disabled={appointment.status === 'cancelled'}>
                  <X className="mr-2 h-4 w-4" /> Cancel appointment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
        <CardDescription>
          Appointment by{' '}
          <Link
            href={`/users/${appointment.patientName}`}
            className="text-primary transition-all hover:text-primary/80"
          >
            {appointment.patientName}
          </Link>{' '}
          with Dr.{' '}
          <Link
            href={`/users/${appointment.doctorName}`}
            className="text-primary transition-all hover:text-primary/80"
          >
            {appointment.doctorName}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointment.status === 'cancelled' && (
          <div className="rounded-md bg-red-800/20 p-4">
            <div className="flex items-center gap-2">
              <X className="h-6 w-6 text-red-700" />
              <span className="font-semibold text-red-700">
                Appointment was cancelled
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The appointment was cancelled on{' '}
              {format(parseISO(appointment.cancelledAt), 'EEE, do MMM, yyyy')}{' '}
              at {format(parseISO(appointment.cancelledAt), 'h:mm a')} (
              {formatDistanceToNow(parseISO(appointment.cancelledAt))} ago)
            </p>
          </div>
        )}
        {appointment.status === 'pending' && (
          <div className="rounded-md bg-orange-700/20 p-4">
            <div className="flex items-center gap-2">
              <Timer className="h-6 w-6 text-orange-700" />
              <span className="font-semibold text-orange-700">
                Appointment is pending
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The appointment is scheduled for{' '}
              {format(
                parseISO(appointment.appointmentDate),
                'EEE, do MMM, yyyy'
              )}{' '}
              at {format(parseISO(appointment.appointmentDate), 'h:mm a')} (In{' '}
              {formatDistanceToNow(parseISO(appointment.appointmentDate))})
            </p>
          </div>
        )}
        {appointment.status === 'completed' && (
          <div className="rounded-md bg-green-700/20 p-4">
            <div className="flex items-center gap-2">
              <Check className="h-6 w-6 text-green-700" />
              <span className="font-semibold text-green-700">
                Appointment is completed
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The appointment was completed on{' '}
              {format(
                parseISO(appointment.appointmentDate),
                'EEE, do MMM, yyyy'
              )}{' '}
              at {format(parseISO(appointment.appointmentDate), 'h:mm a')} (
              {formatDistanceToNow(parseISO(appointment.appointmentDate))} ago)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
