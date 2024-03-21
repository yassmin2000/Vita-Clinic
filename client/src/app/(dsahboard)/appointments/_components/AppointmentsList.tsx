'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { appointments as appointmentsData } from './appointmentData';

import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';
import AppointmentItemSkeleton from './AppointmentItemSkeleton';

import { useTableOptions } from '@/hooks/useTableOptions';
import AppointmentsListItem from './AppointmentsListItem';

export default function AppointmentsList() {
  const {
    sortBy,
    setSortBy,
    searchValue,
    currentPage,
    countPerPage,
    currentAppointmentStatus,
    reset,
  } = useTableOptions();

  const {
    data: appointments,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `appointments_page_${currentPage}_status_${currentAppointmentStatus}_count_${countPerPage}_sort_${sortBy}_search_${searchValue}`,
    ],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const [sortWith, sortHow] = sortBy.split('-');
      if (
        sortWith !== 'patientName' &&
        sortWith !== 'doctorName' &&
        sortWith !== 'appointmentDate'
      )
        return null;

      return appointmentsData
        .filter(
          (appointment) =>
            (currentAppointmentStatus === 'all' ||
              appointment.status.toLowerCase() === currentAppointmentStatus) &&
            (appointment.patientName
              .toLowerCase()
              .includes(searchValue.toLowerCase()) ||
              appointment.doctorName
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
    setSortBy('appointmentDate-desc');
  }, []);

  return (
    <>
      <FiltersBar
        refetch={refetch}
        appointmentStatusFilter
        searchFilter
        searchPlaceholder="Search by patient name or doctor name"
        sortingEnabled
        sortByPatientNameEnabled
        sortByDoctorNameEnabled
        sortByAppointmentDateEnabled
        addNewButton={false}
        addNewRoute="/"
        addNewContent=""
      />

      <div className="flex flex-col gap-2">
        {isLoading &&
          Array.from({ length: 7 }).map((_, index) => (
            <AppointmentItemSkeleton key={index} />
          ))}
        {appointments && appointments.length === 0 && (
          <p>No appointments found</p>
        )}

        {appointments &&
          appointments.length > 0 &&
          appointments.map((appointment) => (
            <AppointmentsListItem
              key={appointment.id}
              id={appointment.id}
              patientName={appointment.patientName}
              doctorName={appointment.doctorName}
              appointmentDate={appointment.appointmentDate}
              bookedAt={appointment.bookedAt}
              cancelledAt={appointment.cancelledAt}
              status={appointment.status}
            />
          ))}
      </div>

      <Pagination
        previousDisabled={currentPage === 1 || isLoading}
        nextDisabled={
          (appointments && appointments.length < countPerPage) || isLoading
        }
      />
    </>
  );
}
