'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { columns } from './DoctorsColumn';
import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';
import { useFiltersStore } from '@/hooks/useFiltersStore';

import type { Doctor } from '@/types/users.type';

export default function DoctorsTable() {
  const accessToken = useAccessToken();
  const { role, isSuperAdmin } = useUserRole();

  const {
    sortBy,
    searchValue,
    currentGender,
    currentStatus,
    currentPage,
    countPerPage,
    setCurrentStatus,
    reset,
  } = useFiltersStore();

  const {
    data: doctors,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `doctors_page_${currentPage}_count_${countPerPage}_sex_${currentGender}_status_${currentStatus}_sort_${sortBy}_search_${searchValue}`,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/doctors?page=${currentPage}&limit=${countPerPage}&sex=${currentGender}&status=${currentStatus}&value=${searchValue}&sort=${sortBy}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Doctor[];
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    reset();
    setCurrentStatus('active');
  }, []);

  return (
    <>
      <FiltersBar
        refetch={refetch}
        genderFilter
        statusFilter={isSuperAdmin}
        searchFilter
        searchPlaceholder="Search by name or email address"
        sortingEnabled
        sortByNameEnabled
        sortByAgeEnabled
        sortByDateEnabled
        sortByActiveEnabled={isSuperAdmin}
        addNewButton={role === 'admin'}
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
