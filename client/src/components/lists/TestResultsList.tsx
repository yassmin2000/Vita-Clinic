'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import FiltersBar from '@/components/FiltersBar';
import TestResultsItem from './TestResultsItem';
import Pagination from '@/components/Pagination';
import ReportItemSkeleton from '@/components/skeletons/ReportItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import { useTableOptions } from '@/hooks/useTableOptions';

import type { TestResult } from '@/types/appointments.type';

interface TestResultsListProps {
  patientId?: string;
  viewAll?: boolean;
}

export default function TestResultsList({
  patientId,
  viewAll = false,
}: TestResultsListProps) {
  const {
    currentPage,
    countPerPage,
    setCountPerPage,
    reset,
    setSortBy,
    searchValue,
    sortBy,
  } = useTableOptions();
  const accessToken = useAccessToken();

  const {
    data: testResults,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `test_results_page_${currentPage}_count_${countPerPage}_sort_${sortBy}_search_${searchValue}_patient_${patientId}`,
    ],
    queryFn: async () => {
      let url;
      if (patientId) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/users/patients/${patientId}/test-results?page=${currentPage}&limit=${countPerPage}&value=${searchValue}&sort=${sortBy}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/users/patients/test-results?page=${currentPage}&limit=${countPerPage}&value=${searchValue}&sort=${sortBy}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data as TestResult[];
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    reset();
    setSortBy('createdAt-desc');
    if (viewAll) {
      setCountPerPage(5000);
    }
  }, [viewAll]);

  return (
    <>
      {!viewAll && (
        <FiltersBar
          refetch={refetch}
          searchFilter
          searchPlaceholder="Search by report title"
          sortingEnabled
          sortByNameEnabled
          sortByDateEnabled
          dateTitle="Created at"
        />
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ReportItemSkeleton key={index} />
          ))}
        {testResults &&
          testResults.length > 0 &&
          testResults.map((results) => (
            <TestResultsItem key={results.id} testResults={results} />
          ))}
      </div>

      {!viewAll && (
        <Pagination
          previousDisabled={currentPage === 1 || isLoading}
          nextDisabled={
            (testResults && testResults.length < countPerPage) || isLoading
          }
        />
      )}
    </>
  );
}
