'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';
import AppointmentsListItem from './AppointmentsListItem';
import AppointmentItemSkeleton from './AppointmentItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';
import { useTableOptions } from '@/hooks/useTableOptions';

import type { Appointment } from '@/types/appointments.type';

export default function AppointmentsList() {
  const accessToken = useAccessToken();
  const { role } = useUserRole();

  const {
    sortBy,
    setSortBy,
    searchValue,
    currentPage,
    countPerPage,
    currentAppointmentStatus,
    currentVisibleAppointments,
    setCurrentVisibleAppointments,
    reset,
  } = useTableOptions();

  const {
    data: appointments,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `appointments_page_${currentPage}_count_${countPerPage}_status_${currentAppointmentStatus}_show_${currentVisibleAppointments}_sort_${sortBy}_search_${searchValue}`,
    ],
    queryFn: async () => {
      let url = '';
      if (role === 'patient') {
        url = `${process.env.NEXT_PUBLIC_API_URL}/users/patients/appointments?page=${currentPage}&limit=${countPerPage}&status=${currentAppointmentStatus}&value=${searchValue}&sort=${sortBy}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/appointments?page=${currentPage}&limit=${countPerPage}&status=${currentAppointmentStatus}&doctor=${currentVisibleAppointments === 'yours' ? true : false}&value=${searchValue}&sort=${sortBy}`;
      }

      const response = await axios.get(url, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data as Appointment[];
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    reset();
    setSortBy('date-desc');
    if (role === 'doctor') {
      setCurrentVisibleAppointments('yours');
    }
  }, [role]);

  return (
    <>
      <FiltersBar
        refetch={refetch}
        appointmentsVisibleFilter={role === 'doctor'}
        appointmentStatusFilter
        searchFilter
        searchPlaceholder={
          role === 'patient'
            ? 'Search by doctor name'
            : 'Search by patient name or doctor name'
        }
        sortingEnabled
        sortByPatientNameEnabled={role !== 'patient'}
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
              appointmentNumber={appointment.number}
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
              insurance={appointment.emr?.insurance}
              queryKey={`appointments_page_${currentPage}_count_${countPerPage}_status_${currentAppointmentStatus}_sort_${sortBy}_search_${searchValue}`}
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
