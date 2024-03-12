'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { bookings as bookingsData } from './bookingData';

import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';
import BookingItemSkeleton from './BookingItemSkeleton';

import { useTableOptions } from '@/hooks/useTableOptions';
import BookingsListItem from './BookingsListItem';

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
          bookings.map((booking) => (
            <BookingsListItem
              key={booking.id}
              id={booking.id}
              patientName={booking.patientName}
              doctorName={booking.doctorName}
              bookingDate={booking.bookingDate}
              bookedAt={booking.bookedAt}
              cancelledAt={booking.cancelledAt}
              status={booking.status}
            />
          ))}
      </div>

      <Pagination
        previousDisabled={currentPage === 1 || isLoading}
        nextDisabled={(bookings && bookings.length < countPerPage) || isLoading}
      />
    </>
  );
}
