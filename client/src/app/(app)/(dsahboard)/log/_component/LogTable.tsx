'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { columns } from './LogColumn';
import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';

import useAccessToken from '@/hooks/useAccessToken';
import { useTableOptions } from '@/hooks/useTableOptions';

import { Action } from '@/types/log.type';

export default function LogTable() {
  const accessToken = useAccessToken();

  const { sortBy, setSortBy, currentPage, countPerPage, searchValue, reset } =
    useTableOptions();

  const {
    data: actions,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `log_page_${currentPage}_count_${countPerPage}_sort_${sortBy}_search_${searchValue}`,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/log?page=${currentPage}&limit=${countPerPage}&sort=${sortBy}&value=${searchValue}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Action[];
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    reset();
    setSortBy('date-desc');
  }, []);

  return (
    <>
      <FiltersBar
        refetch={refetch}
        searchFilter
        searchPlaceholder="Search by user name or target name"
        sortingEnabled
        sortByActionDateEnabled
      />
      <DataTable columns={columns} data={actions || []} isLoading={isLoading} />
      <Pagination
        previousDisabled={currentPage === 1 || isLoading}
        nextDisabled={(actions && actions.length < countPerPage) || isLoading}
      />
    </>
  );
}
