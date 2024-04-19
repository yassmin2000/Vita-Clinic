'use client';
import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { type Admin, columns } from './AdminColumn';
import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';

import useAccessToken from '@/hooks/useAccessToken';
import { useTableOptions } from '@/hooks/useTableOptions';

export default function AdminsTable() {
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
    data: admins,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `admins_page_${currentPage}_count_${countPerPage}_sex_${currentGender}_sort_${sortBy}_search_${searchValue}`,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admins?page=${currentPage}&limit=${countPerPage}&sex=${currentGender}&value=${searchValue}&sort=${sortBy}`,
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
