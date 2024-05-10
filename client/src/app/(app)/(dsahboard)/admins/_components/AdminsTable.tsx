'use client';
import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { columns } from './AdminColumn';
import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';
import { useTableOptions } from '@/hooks/useTableOptions';

import type { Admin } from '@/types/users.type';

export default function AdminsTable() {
  const accessToken = useAccessToken();
  const { isSuperAdmin } = useUserRole();

  const {
    sortBy,
    searchValue,
    currentGender,
    currentStatus,
    currentPage,
    countPerPage,
    setCurrentStatus,
    reset,
  } = useTableOptions();

  const {
    data: admins,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `admins_page_${currentPage}_count_${countPerPage}_sex_${currentGender}_status_${currentStatus}_sort_${sortBy}_search_${searchValue}`,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admins?page=${currentPage}&limit=${countPerPage}&sex=${currentGender}&status=${currentStatus}&value=${searchValue}&sort=${sortBy}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Admin[];
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
        addNewButton={isSuperAdmin}
        addNewRoute="/users/new?role=admin"
        addNewContent="New Admin"
      />
      <DataTable columns={columns} data={admins || []} isLoading={isLoading} />
      <Pagination
        previousDisabled={currentPage === 1 || isLoading}
        nextDisabled={(admins && admins.length < countPerPage) || isLoading}
      />
    </>
  );
}
