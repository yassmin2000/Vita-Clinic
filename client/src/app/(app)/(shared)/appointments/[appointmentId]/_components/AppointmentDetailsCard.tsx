'use client';

import Link from 'next/link';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import {
  Check,
  CheckCheck,
  CircleOff,
  Download,
  MoreVertical,
  Timer,
  X,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Separator } from '@/components/ui/separator';

import useUserRole from '@/hooks/useUserRole';

import type { AppointmentStatus } from '@/types/appointments.type';

interface AppointmentDetailsCardProps {
  id: string;
  appointmentNumber: number;
  status: AppointmentStatus;
  doctorId?: string;
  doctorName?: string;
  patientId: string;
  patientName: string;
  date: string;
  cancelledDate: string;
  serviceName?: string;
  therapyName?: string;
  serviceScans: string[];
  serviceLabWorks: string[];
  billingNumber: number;
  billingStatus: string;
  billingAmount: number;
}

export default function AppointmentDetailsCard({
  id,
  appointmentNumber,
  status,
  doctorId,
  doctorName,
  patientId,
  patientName,
  date,
  cancelledDate,
  serviceName,
  therapyName,
  serviceScans,
  serviceLabWorks,
  billingNumber,
  billingStatus,
  billingAmount,
}: AppointmentDetailsCardProps) {
  const { role } = useUserRole();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-primary">
                Appointment #{appointmentNumber}
              </span>
              <Badge variant={status} className="capitalize">
                {status}
              </Badge>
            </div>

            {role === 'admin' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  {status === 'pending' && (
                    <>
                      <DropdownMenuItem>
                        <Check className="mr-2 h-4 w-4" /> Approve appointment
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <X className="mr-2 h-4 w-4" /> Reject appointment
                      </DropdownMenuItem>
                    </>
                  )}
                  {status !== 'pending' && (
                    <>
                      <DropdownMenuItem disabled={status === 'completed'}>
                        <Check className="mr-2 h-4 w-4" /> Mark as completed
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={status === 'cancelled'}>
                        <X className="mr-2 h-4 w-4" /> Cancel appointment
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Appointment by{' '}
          <Link
            href={`/users/${patientId}`}
            className="text-primary transition-all hover:text-primary/80"
          >
            {patientName}
          </Link>{' '}
          with Dr.{' '}
          <Link
            href={`/users/${doctorId}`}
            className="text-primary transition-all hover:text-primary/80"
          >
            {doctorName}
          </Link>
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
              {format(parseISO(cancelledDate), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(cancelledDate), 'h:mm a')} (
              {formatDistanceToNow(parseISO(cancelledDate))} ago)
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
              {format(parseISO(date), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(date), 'h:mm a')} (In{' '}
              {formatDistanceToNow(parseISO(date))})
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
              {format(parseISO(date), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(date), 'h:mm a')} (
              {formatDistanceToNow(parseISO(date))} ago)
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
              {format(parseISO(date), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(date), 'h:mm a')} (In{' '}
              {formatDistanceToNow(parseISO(date))})
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
              {format(parseISO(cancelledDate), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(cancelledDate), 'h:mm a')} (
              {formatDistanceToNow(parseISO(cancelledDate))} ago)
            </p>
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="flex flex-col">
          <span className="font-medium text-primary">Date</span>
          <span className="text-foreground">
            {format(parseISO(date), 'do MMM, yyyy')}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-primary">Time</span>
          <span className="text-foreground">
            {format(parseISO(date), 'h:mm a')}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-primary">Patient</span>
          <span className="text-foreground">{patientName}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-primary">Doctor</span>
          <span className="text-foreground">{doctorName || 'NA'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-primary">Service</span>
          <span className="text-foreground">{serviceName || 'NA'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-primary">Therapy</span>
          <span className="text-foreground">{therapyName || 'NA'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-primary">Scans</span>
          <span className="text-foreground">
            {serviceScans.length > 0 ? serviceScans.join(', ') : 'NA'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-primary">Lab Works</span>
          <span className="text-foreground">
            {serviceLabWorks.length > 0 ? serviceLabWorks.join(', ') : 'NA'}
          </span>
        </div>
      </CardFooter>

      <Separator />

      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-medium text-primary">Billing</span>
            <span className="flex items-center text-foreground">
              Invoice #{billingNumber} -{' '}
              {billingAmount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}{' '}
              <Badge
                variant={
                  billingStatus === 'initial' ? 'cancelled' : 'completed'
                }
                className="ml-2 capitalize"
              >
                {billingStatus === 'initial' ? 'Not Paid' : 'Paid'}
              </Badge>
            </span>
          </div>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Invoice
          </Button>
        </div>
      </div>
    </Card>
  );
}
