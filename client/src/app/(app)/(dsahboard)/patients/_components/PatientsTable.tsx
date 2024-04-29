'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { columns } from './PatientsColumn';
import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';
import { useTableOptions } from '@/hooks/useTableOptions';

import type { Patient } from '@/types/users.type';

export default function PatientsTable() {
  const accessToken = useAccessToken();
  const { role } = useUserRole();

  const {
    sortBy,
    searchValue,
    currentGender,
    currentPage,
    countPerPage,
    reset,
  } = useTableOptions();

  const {
    data: patients,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `patients_page_${currentPage}_count_${countPerPage}_sex_${currentGender}_sort_${sortBy}_search_${searchValue}`,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/patients?page=${currentPage}&limit=${countPerPage}&sex=${currentGender}&value=${searchValue}&sort=${sortBy}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Patient[];
    },
    enabled: !!accessToken,
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
        addNewButton={role === 'admin'}
        addNewRoute="/users/new?role=patient"
        addNewContent="New Patient"
      />
      <DataTable
        columns={columns}
        data={patients || []}
        isLoading={isLoading}
      />
      <Pagination
        previousDisabled={currentPage === 1 || isLoading}
        nextDisabled={(patients && patients.length < countPerPage) || isLoading}
      />
    </>
  );
}
