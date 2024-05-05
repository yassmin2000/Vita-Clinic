'use client';

import Link from 'next/link';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Check, CheckCheck, CircleOff, Download, Timer, X } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AppointmentDropdownMenu from '../../_components/AppointmentDropdownMenu';
import AppointmentVitals from './AppointmentVitals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import useUserRole from '@/hooks/useUserRole';

import type { AppointmentDetails } from '@/types/appointments.type';

interface AppointmentDetailsCardProps {
  appointment: AppointmentDetails;
}

export default function AppointmentDetailsCard({
  appointment,
}: AppointmentDetailsCardProps) {
  const { role } = useUserRole();
  const status = appointment.status;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-primary">
                Appointment #{appointment.number}
              </span>
              <Badge variant={status} className="capitalize">
                {status}
              </Badge>
            </div>

            {role === 'admin' && (
              <AppointmentDropdownMenu
                id={appointment.id}
                appointmentNumber={appointment.number}
                status={status}
                viewOption={false}
                queryKey={`appointment_${appointment.id}`}
              />
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Appointment by{' '}
          <Link
            href={`/users/${appointment.patientId}`}
            className="text-primary transition-all hover:text-primary/80"
          >
            {`${appointment.patient.firstName} ${appointment.patient.lastName}`}
          </Link>
          {appointment.doctor && (
            <>
              {' '}
              with Dr.{' '}
              <Link
                href={`/users/${appointment.doctorId}`}
                className="text-primary transition-all hover:text-primary/80"
              >
                {`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
              </Link>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'cancelled' && (
          <div className="rounded-md bg-red-800/20 p-4">
            <div className="flex items-center gap-2">
              <X className="h-6 w-6 text-red-700" />
              <span className="font-semibold text-red-700">
                Appointment was cancelled
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The appointment was cancelled on{' '}
              {format(parseISO(appointment.updatedAt), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(appointment.updatedAt), 'h:mm a')} (
              {formatDistanceToNow(parseISO(appointment.updatedAt))} ago)
            </p>
          </div>
        )}
        {status === 'pending' && (
          <div className="rounded-md bg-orange-700/20 p-4">
            <div className="flex items-center gap-2">
              <Timer className="h-6 w-6 text-orange-700" />
              <span className="font-semibold text-orange-700">
                Appointment is pending
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The appointment is scheduled for{' '}
              {format(parseISO(appointment.date), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(appointment.date), 'h:mm a')} (In{' '}
              {formatDistanceToNow(parseISO(appointment.date))})
            </p>
          </div>
        )}
        {status === 'completed' && (
          <div className="rounded-md bg-green-700/20 p-4">
            <div className="flex items-center gap-2">
              <CheckCheck className="h-6 w-6 text-green-700" />
              <span className="font-semibold text-green-700">
                Appointment is completed
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The appointment was completed on{' '}
              {format(parseISO(appointment.date), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(appointment.date), 'h:mm a')} (
              {formatDistanceToNow(parseISO(appointment.date))} ago)
            </p>
          </div>
        )}
        {status === 'approved' && (
          <div className="rounded-md bg-blue-700/20 p-4">
            <div className="flex items-center gap-2">
              <Check className="h-6 w-6 text-blue-700" />
              <span className="font-semibold text-blue-700">
                Appointment is approved
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The appointment is approved and scheduled for{' '}
              {format(parseISO(appointment.date), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(appointment.date), 'h:mm a')} (In{' '}
              {formatDistanceToNow(parseISO(appointment.date))})
            </p>
          </div>
        )}
        {status === 'rejected' && (
          <div className="rounded-md bg-yellow-700/20 p-4">
            <div className="flex items-center gap-2">
              <CircleOff className="h-6 w-6 text-yellow-700" />
              <span className="font-semibold text-yellow-700">
                Appointment is rejected
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The appointment was rejected on{' '}
              {format(parseISO(appointment.updatedAt), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(appointment.updatedAt), 'h:mm a')} (
              {formatDistanceToNow(parseISO(appointment.updatedAt))} ago)
            </p>
          </div>
        )}
      </CardContent>

      <Separator />
      <CardFooter className="block p-0">
        <div className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="flex flex-col">
            <span className="font-medium text-primary">Date</span>
            <span className="text-foreground">
              {format(parseISO(appointment.date), 'do MMM, yyyy')}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-primary">Time</span>
            <span className="text-foreground">
              {format(parseISO(appointment.date), 'h:mm a')}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-primary">Patient</span>
            <span className="text-foreground">
              {`${appointment.patient.firstName} ${appointment.patient.lastName}`}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-primary">Doctor</span>
            <span className="text-foreground">
              {appointment.doctor
                ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                : 'NA'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-primary">Service</span>
            <span className="text-foreground">
              {appointment.services.service?.name || 'NA'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-primary">Therapy</span>
            <span className="text-foreground">
              {appointment.services.therapy?.name || 'NA'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-primary">Scans</span>
            <span className="text-foreground">
              {appointment.services.scans.length > 0
                ? appointment.services.scans.map((scan) => scan.name).join(', ')
                : 'NA'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-primary">Lab Works</span>
            <span className="text-foreground">
              {appointment.services.labWorks.length > 0
                ? appointment.services.labWorks
                    .map((labWork) => labWork.name)
                    .join(', ')
                : 'NA'}
            </span>
          </div>
        </div>

        <Separator />
        <AppointmentVitals
          appointmentId={appointment.id}
          vitals={appointment.vitals}
        />
        <Separator />

        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-primary">Billing</span>
              <span className="flex items-center text-foreground">
                Invoice #{appointment.billing.number} -{' '}
                {appointment.billing.amount.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}{' '}
                <Badge
                  variant={
                    appointment.billing.status === 'initial'
                      ? 'cancelled'
                      : 'completed'
                  }
                  className="ml-2 capitalize"
                >
                  {appointment.billing.status === 'initial'
                    ? 'Not Paid'
                    : appointment.billing.status === 'paid'
                      ? 'Paid'
                      : 'Covered By Insurance'}
                </Badge>
              </span>
            </div>
            <Button size="sm" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Invoice
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
