'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import FiltersBar from '@/components/FiltersBar';
import ScanItem from '@/components/ScanItem';
import Pagination from '@/components/Pagination';
import ScanItemSkeleton from '@/components/ScanItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import { useTableOptions } from '@/hooks/useTableOptions';

import type { Scan } from '@/types/appointments.type';

const scansData = [
  {
    id: 1,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'CT',
  },
  {
    id: 2,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'MRI',
  },
  {
    id: 3,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'MRI',
  },
  {
    id: 4,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'X-Ray',
  },
  {
    id: 5,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'PET',
  },
  {
    id: 6,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'PET',
  },
  {
    id: 7,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'MRI',
  },
  {
    id: 8,
    name: 'Scan name',
    date: '2024-03-16T18:04:33.256Z',
    modality: 'MRI',
  },
];

export default function ScansList() {
  const { currentPage, countPerPage, reset, setSortBy, searchValue, sortBy } =
    useTableOptions();
  const accessToken = useAccessToken();

  const {
    data: scans,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `scans_page_${currentPage}_count_${countPerPage}_sort_${sortBy}_search_${searchValue}`,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/patients/scans?page=${currentPage}&limit=${countPerPage}&value=${searchValue}&sort=${sortBy}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Scan[];
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
        searchPlaceholder="Search by scan title"
        sortingEnabled
        sortByNameEnabled
        sortByDateEnabled
        dateTitle="Created at"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ScanItemSkeleton key={index} />
          ))}
        {scans &&
          scans.length > 0 &&
          scans.map((scan) => (
            <ScanItem
              key={scan.id}
              id={scan.id}
              title={scan.title}
              modality={scan.modality.name}
              date={scan.createdAt}
            />
          ))}
      </div>

      <Pagination
        previousDisabled={currentPage === 1 || isLoading}
        nextDisabled={(scans && scans.length < countPerPage) || isLoading}
      />
    </>
  );
}
