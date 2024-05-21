'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import FiltersBar from '@/components/FiltersBar';
import TreatmentItem from './TreatmentItem';
import Pagination from '@/components/Pagination';
import ReportItemSkeleton from '@/components/skeletons/ReportItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import { useTableOptions } from '@/hooks/useTableOptions';

import type { Treatment } from '@/types/appointments.type';

interface TreatmentsListProps {
  patientId?: string;
}

export default function TreatmentsList({ patientId }: TreatmentsListProps) {
  const { currentPage, countPerPage, reset, setSortBy, searchValue, sortBy } =
    useTableOptions();
  const accessToken = useAccessToken();

  const {
    data: treatments,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `treatments_page_${currentPage}_count_${countPerPage}_sort_${sortBy}_search_${searchValue}_patient_${patientId}`,
    ],
    queryFn: async () => {
      let url;
      if (patientId) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/users/patients/${patientId}/treatments?page=${currentPage}&limit=${countPerPage}&value=${searchValue}&sort=${sortBy}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/users/patients/treatments?page=${currentPage}&limit=${countPerPage}&value=${searchValue}&sort=${sortBy}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data as Treatment[];
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
        {treatments &&
          treatments.length > 0 &&
          treatments.map((treatment) => (
            <TreatmentItem key={treatment.id} treatment={treatment} />
          ))}
      </div>

      <Pagination
        previousDisabled={currentPage === 1 || isLoading}
        nextDisabled={
          (treatments && treatments.length < countPerPage) || isLoading
        }
      />
    </>
  );
}
