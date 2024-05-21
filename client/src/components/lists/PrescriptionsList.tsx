'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import FiltersBar from '@/components/FiltersBar';
import PrescriptionItem from './PrescriptionItem';
import Pagination from '@/components/Pagination';
import ReportItemSkeleton from '@/components/skeletons/ReportItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import { useTableOptions } from '@/hooks/useTableOptions';

import type { Prescription } from '@/types/appointments.type';

interface PrescriptionsListProps {
  patientId?: string;
}

export default function PrescriptionsList({
  patientId,
}: PrescriptionsListProps) {
  const { currentPage, countPerPage, reset, setSortBy, searchValue, sortBy } =
    useTableOptions();
  const accessToken = useAccessToken();

  const {
    data: prescriptions,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `prescriptions_page_${currentPage}_count_${countPerPage}_sort_${sortBy}_search_${searchValue}_patient_${patientId}`,
    ],
    queryFn: async () => {
      let url;
      if (patientId) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/users/patients/${patientId}/prescriptions?page=${currentPage}&limit=${countPerPage}&value=${searchValue}&sort=${sortBy}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/users/patients/prescriptions?page=${currentPage}&limit=${countPerPage}&value=${searchValue}&sort=${sortBy}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data as Prescription[];
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    reset();
    setSortBy('createdAt-desc');
  }, []);

  return (
    <>
      <FiltersBar
        refetch={refetch}
        searchFilter
        searchPlaceholder="Search by report title"
        sortingEnabled
        sortByNameEnabled
        sortByDateEnabled
        dateTitle="Created at"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ReportItemSkeleton key={index} />
          ))}
        {prescriptions &&
          prescriptions.length > 0 &&
          prescriptions.map((prescription) => (
            <PrescriptionItem
              key={prescription.id}
              prescription={prescription}
            />
          ))}
      </div>

      <Pagination
        previousDisabled={currentPage === 1 || isLoading}
        nextDisabled={
          (prescriptions && prescriptions.length < countPerPage) || isLoading
        }
      />
    </>
  );
}
