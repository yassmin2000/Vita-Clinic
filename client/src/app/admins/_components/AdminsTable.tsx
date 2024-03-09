'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { admins as adminsData } from './adminsData';

import { DataTable } from '@/components/DataTable';
import { columns } from './AdminColumn';
import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';

import { useTableOptions } from '@/hooks/useTableOptions';

export default function AdminsTable() {
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
    isFetched,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [
      `admin_page_${currentPage}_count_${countPerPage}_gender_${currentGender}_sort_${sortBy}_search_${searchValue}_count_${countPerPage}`,
    ],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const [sortWith, sortHow] = sortBy.split('-');
      if (
        sortWith !== 'name' &&
        sortWith !== 'joinedAt' &&
        sortWith !== 'birthDate'
      )
        return null;

      return adminsData
        .filter(
          (admin) =>
            (currentGender === 'all' ||
              admin.gender.toLowerCase() === currentGender) &&
            (admin.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              admin.email.toLowerCase().includes(searchValue.toLowerCase()))
        )
        .sort((a, b) => {
          if (a[sortWith] < b[sortWith]) {
            return sortHow === 'desc' ? 1 : -1;
          }
          if (a[sortWith] > b[sortWith]) {
            return sortHow === 'desc' ? -1 : 1;
          }
          return 0;
        })
        .slice((currentPage - 1) * countPerPage, currentPage * countPerPage);
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
        specialtyFilter
        searchFilter
        searchPlaceholder="Search by name or email address"
        sortingEnabled
        sortByNameEnabled
        sortByAgeEnabled
        sortByDateEnabled
        addNewButton
        addNewRoute="/user/new?role=admin"
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
