'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { columns } from './DoctorsColumn';
import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';

import useAccessToken from '@/hooks/useAccessToken';
import { useTableOptions } from '@/hooks/useTableOptions';

export default function DoctorsTable() {
  const accessToken = useAccessToken();

  const {
    sortBy,
    searchValue,
    currentGender,
    currentPage,
    countPerPage,
    reset,
  } = useTableOptions();

  const {
    data: doctors,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `doctors_page_${currentPage}_count_${countPerPage}_sex_${currentGender}_sort_${sortBy}_search_${searchValue}`,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/doctors?page=${currentPage}&limit=${countPerPage}&sex=${currentGender}&value=${searchValue}&sort=${sortBy}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    },
  });

  useEffect(() => {
    reset();
  }, []);

  return (
    <>
      <FiltersBar
        refetch={refetch}
        genderFilter
        searchFilter
        searchPlaceholder="Search by name or email address"
        sortingEnabled
        sortByNameEnabled
        sortByAgeEnabled
        sortByDateEnabled
        addNewButton
        addNewRoute="/users/new?role=doctor"
        addNewContent="New Doctor"
      />
      <DataTable columns={columns} data={doctors || []} isLoading={isLoading} />
      <Pagination
        previousDisabled={currentPage === 1 || isLoading}
        nextDisabled={(doctors && doctors.length < countPerPage) || isLoading}
      />
    </>
  );
}
