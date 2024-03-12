import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { format, formatDistanceToNow, parseISO } from 'date-fns';

import { Check, MoreVertical, Timer, X } from 'lucide-react';
import Link from 'next/link';

type Booking = {
  id: number;
  patientName: string;
  doctorName: string;
  bookingDate: string;
  bookedAt: string;
  cancelledAt: string;
  status: 'completed' | 'pending' | 'cancelled';
};

const booking: Booking = {
  id: 1,
  patientName: 'Douglas West',
  doctorName: 'Ed Murphy',
  bookingDate: '2024-03-16T18:04:33.256Z',
  bookedAt: '2023-02-09T16:28:55.721Z',
  cancelledAt: '2021-12-15T13:47:50.681Z',
  status: 'completed',
};

export default async function BookingDetailsCard() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-primary">
                Booking #{booking.id}
              </span>
              <Badge variant={booking.status} className="capitalize">
                {booking.status}
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
                <DropdownMenuItem disabled={booking.status === 'completed'}>
                  <Check className="mr-2 h-4 w-4" /> Mark as completed
                </DropdownMenuItem>
                <DropdownMenuItem disabled={booking.status === 'cancelled'}>
                  <X className="mr-2 h-4 w-4" /> Cancel booking
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
        <CardDescription>
          Booking by{' '}
          <Link
            href={`/users/${booking.patientName}`}
            className="text-primary transition-all hover:text-primary/80"
          >
            {booking.patientName}
          </Link>{' '}
          with Dr.{' '}
          <Link
            href={`/users/${booking.doctorName}`}
            className="text-primary transition-all hover:text-primary/80"
          >
            {booking.doctorName}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {booking.status === 'cancelled' && (
          <div className="rounded-md bg-red-800/20 p-4">
            <div className="flex items-center gap-2">
              <X className="h-6 w-6 text-red-700" />
              <span className="font-semibold text-red-700">
                Booking was cancelled
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The booking was cancelled on{' '}
              {format(parseISO(booking.cancelledAt), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(booking.cancelledAt), 'h:mm a')} (
              {formatDistanceToNow(parseISO(booking.cancelledAt))} ago)
            </p>
          </div>
        )}
        {booking.status === 'pending' && (
          <div className="rounded-md bg-orange-700/20 p-4">
            <div className="flex items-center gap-2">
              <Timer className="h-6 w-6 text-orange-700" />
              <span className="font-semibold text-orange-700">
                Booking is pending
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The booking is scheduled for{' '}
              {format(parseISO(booking.bookingDate), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(booking.bookingDate), 'h:mm a')} (In{' '}
              {formatDistanceToNow(parseISO(booking.bookingDate))})
            </p>
          </div>
        )}
        {booking.status === 'completed' && (
          <div className="rounded-md bg-green-700/20 p-4">
            <div className="flex items-center gap-2">
              <Check className="h-6 w-6 text-green-700" />
              <span className="font-semibold text-green-700">
                Booking is completed
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The booking was completed on{' '}
              {format(parseISO(booking.bookingDate), 'EEE, do MMM, yyyy')} at{' '}
              {format(parseISO(booking.bookingDate), 'h:mm a')} (
              {formatDistanceToNow(parseISO(booking.bookingDate))} ago)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
