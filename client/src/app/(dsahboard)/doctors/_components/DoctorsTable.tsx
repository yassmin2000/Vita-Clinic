'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { doctors as doctorsData } from './doctorsData';

import { DataTable } from '@/components/DataTable';
import { columns } from './DoctorsColumn';
import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';

import { useTableOptions } from '@/hooks/useTableOptions';

export default function DoctorsTable() {
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
      `doctors_page_${currentPage}_count_${countPerPage}_gender_${currentGender}_sort_${sortBy}_search_${searchValue}_count_${countPerPage}`,
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

      return doctorsData
        .filter(
          (doctor) =>
            (currentGender === 'all' ||
              doctor.gender.toLowerCase() === currentGender) &&
            (doctor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              doctor.email.toLowerCase().includes(searchValue.toLowerCase()))
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
