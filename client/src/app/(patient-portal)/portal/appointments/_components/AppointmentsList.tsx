'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';
import AppointmentsListItem from '@/components/AppointmentsListItem';
import AppointmentItemSkeleton from '@/components/AppointmentItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import { useTableOptions } from '@/hooks/useTableOptions';

import type { Appointment } from '@/types/appointments.type';

export default function AppointmentsList() {
  const accessToken = useAccessToken();

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
      `appointments_page_${currentPage}_count_${countPerPage}_status_${currentAppointmentStatus}_sort_${sortBy}_search_${searchValue}`,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/patients/appointments?page=${currentPage}&limit=${countPerPage}&status=${currentAppointmentStatus}&value=${searchValue}&sort=${sortBy}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Appointment[];
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    reset();
    setSortBy('date-desc');
  }, []);

  return (
    <>
      <FiltersBar
        refetch={refetch}
        appointmentStatusFilter
        searchFilter
        searchPlaceholder="Search by patient name or doctor name"
        sortingEnabled
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
              patientName={`${appointment.patient.firstName} ${appointment.patient.lastName}`}
              doctorName={
                appointment.doctor
                  ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                  : ''
              }
              appointmentDate={appointment.date}
              bookedAt={appointment.createdAt}
              cancelledAt={appointment.updatedAt}
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
