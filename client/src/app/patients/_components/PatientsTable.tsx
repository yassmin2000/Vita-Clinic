'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { patients as patientsData } from './patientsData';

import { DataTable } from '@/components/DataTable';
import { columns } from './PatientsColumn';
import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';

import { useTableOptions } from '@/hooks/useTableOptions';

export default function PatientsTable() {
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
      `patients_page_${currentPage}_count_${countPerPage}_gender_${currentGender}_sort_${sortBy}_search_${searchValue}_count_${countPerPage}`,
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

      return patientsData
        .filter(
          (patient) =>
            (currentGender === 'all' ||
              patient.gender.toLowerCase() === currentGender) &&
            (patient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              patient.email.toLowerCase().includes(searchValue.toLowerCase()))
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
