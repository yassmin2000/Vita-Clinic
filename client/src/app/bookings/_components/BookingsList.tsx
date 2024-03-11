'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { X, Check, Timer, ArrowRight } from 'lucide-react';

import { bookings as bookingsData } from './bookingData';

import { Card } from '@/components/ui/card';
import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';
import BookingItemSkeleton from './BookingItemSkeleton';

import { useTableOptions } from '@/hooks/useTableOptions';
import { cn } from '@/lib/utils';

const status = {
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

export default function BookingsList() {
  const {
    sortBy,
    setSortBy,
    searchValue,
    currentPage,
    countPerPage,
    currentBookingStatus,
    reset,
  } = useTableOptions();

  const {
    data: bookings,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `bookings_page_${currentPage}_status_${currentBookingStatus}_count_${countPerPage}_sort_${sortBy}_search_${searchValue}`,
    ],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const [sortWith, sortHow] = sortBy.split('-');
      if (
        sortWith !== 'patientName' &&
        sortWith !== 'doctorName' &&
        sortWith !== 'bookingDate'
      )
        return null;

      return bookingsData
        .filter(
          (booking) =>
            (currentBookingStatus === 'all' ||
              booking.status.toLowerCase() === currentBookingStatus) &&
            (booking.patientName
              .toLowerCase()
              .includes(searchValue.toLowerCase()) ||
              booking.doctorName
                .toLowerCase()
                .includes(searchValue.toLowerCase()))
        )
        .sort((a, b) => {
          if (a[sortWith] < b[sortWith]) {
            return sortHow === 'desc' ? 1 : -1;
          }
          if (a[sortWith] > b[sortWith]) {
            return sortHow === 'desc' ? -1 : 1;
          }
          return 0;
        })
        .slice((currentPage - 1) * countPerPage, currentPage * countPerPage);
    },
  });

  useEffect(() => {
    reset();
    setSortBy('bookingDate-desc');
  }, []);

  return (
    <>
      <FiltersBar
        refetch={refetch}
        bookingStatusFilter
        searchFilter
        searchPlaceholder="Search by patient name or doctor name"
        sortingEnabled
        sortByPatientNameEnabled
        sortByDoctorNameEnabled
        sortByBookingDateEnabled
        addNewButton={false}
        addNewRoute="/"
        addNewContent=""
      />

      <div className="flex flex-col gap-2">
        {isLoading &&
          Array.from({ length: 7 }).map((_, index) => (
            <BookingItemSkeleton key={index} />
          ))}
        {bookings && bookings.length === 0 && <p>No bookings found</p>}

        {bookings &&
          bookings.length > 0 &&
          bookings.map((booking) => {
            const bookingStatus = status[booking.status];

            return (
              <Card
                key={booking.id}
                className="flex items-center justify-between border-black/5 p-4 transition-all dark:border-gray-800"
              >
                <div className="flex items-center gap-x-4">
                  <div
                    className={cn(
                      'w-fit rounded-md p-2',
                      bookingStatus.backgroundColor
                    )}
                  >
                    <bookingStatus.icon
                      className={cn('h-8 w-8', bookingStatus.textColor)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium">
                      Booking by{' '}
                      <Link
                        href={`/user/${booking.patientName}`}
                        className="text-primary transition-all hover:text-primary/80"
                      >
                        {booking.patientName}
                      </Link>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Booked at{' '}
                      {format(parseISO(booking.bookedAt), 'MMM dd, yyyy')}
                    </p>
                    {booking.status === 'pending' && (
                      <p className="text-sm text-muted-foreground">
                        Booking to Dr.{' '}
                        <Link
                          href={`/user/${booking.doctorName}`}
                          className="text-primary transition-all hover:text-primary/80"
                        >
                          {booking.doctorName}
                        </Link>{' '}
                        on{' '}
                        {format(parseISO(booking.bookingDate), 'MMM dd, yyyy')}
                      </p>
                    )}
                    {booking.status === 'cancelled' && (
                      <p className="text-sm text-muted-foreground">
                        Cancelled on{' '}
                        {format(parseISO(booking.cancelledAt), 'MMM dd, yyyy')}
                      </p>
                    )}
                    {booking.status === 'completed' && (
                      <p className="text-sm text-muted-foreground">
                        Booking to Dr.{' '}
                        <Link
                          href={`/user/${booking.doctorName}`}
                          className="text-primary transition-all hover:text-primary/80"
                        >
                          {booking.doctorName}
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
                <Link href={`/booking/${booking.id}`}>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Card>
            );
          })}
      </div>

      <Pagination
        previousDisabled={currentPage === 1 || isLoading}
        nextDisabled={(bookings && bookings.length < countPerPage) || isLoading}
      />
    </>
  );
}
