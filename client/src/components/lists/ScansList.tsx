'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import FiltersBar from '@/components/FiltersBar';
import ScanItem from '@/components/lists/ScanItem';
import Pagination from '@/components/Pagination';
import ScanItemSkeleton from '@/components/skeletons/ScanItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import { useTableOptions } from '@/hooks/useTableOptions';

import type { Scan } from '@/types/appointments.type';

interface ScansListProps {
  patientId?: string;
  viewAll?: boolean;
}

export default function ScansList({
  patientId,
  viewAll = false,
}: ScansListProps) {
  const {
    currentPage,
    countPerPage,
    setCountPerPage,
    reset,
    setSortBy,
    searchValue,
    sortBy,
  } = useTableOptions();
  const accessToken = useAccessToken();

  const {
    data: scans,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `scans_page_${currentPage}_count_${countPerPage}_sort_${sortBy}_search_${searchValue}_patient_${patientId}`,
    ],
    queryFn: async () => {
      let url;
      if (patientId) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/users/patients/${patientId}/scans?page=${currentPage}&limit=${countPerPage}&value=${searchValue}&sort=${sortBy}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/users/patients/scans?page=${currentPage}&limit=${countPerPage}&value=${searchValue}&sort=${sortBy}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data as Scan[];
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    reset();
    setSortBy('createdAt-desc');
    if (viewAll) {
      setCountPerPage(5000);
    }
  }, [viewAll]);

  return (
    <>
      {!viewAll && (
        <FiltersBar
          refetch={refetch}
          searchFilter
          searchPlaceholder="Search by scan title"
          sortingEnabled
          sortByNameEnabled
          sortByDateEnabled
          dateTitle="Created at"
        />
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ScanItemSkeleton key={index} />
          ))}
        {scans &&
          scans.length > 0 &&
          scans.map((scan) => <ScanItem key={scan.id} scan={scan} />)}
      </div>

      {!viewAll && (
        <Pagination
          previousDisabled={currentPage === 1 || isLoading}
          nextDisabled={(scans && scans.length < countPerPage) || isLoading}
        />
      )}
    </>
  );
}
