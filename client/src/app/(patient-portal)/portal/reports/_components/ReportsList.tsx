'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import FiltersBar from '@/components/FiltersBar';
import ReportItem from '@/components/ReportItem';
import Pagination from '@/components/Pagination';
import ReportItemSkeleton from '@/components/ReportItemSkeleton';

import { useTableOptions } from '@/hooks/useTableOptions';

const reportsData = [
  {
    id: 1,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 2,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 3,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 4,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 5,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 6,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 7,
    name: 'Report name',
    fileName: 'report-file-name.pdf',
    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 8,
    name: 'Report name',
    fileName: 'report-file-name.pdf',

    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 9,
    name: 'Report name',
    fileName: 'report-file-name.pdf',

    date: '2024-03-16T18:04:33.256Z',
  },
  {
    id: 10,
    name: 'Report name',
    fileName: 'report-file-name.pdf',

    date: '2024-03-16T18:04:33.256Z',
  },
];

export default function ReportsList() {
  const { currentPage, countPerPage, reset, setSortBy } = useTableOptions();

  const {
    data: reports,
    refetch,
    isLoading,
  } = useQuery({
    // Handle real data fetching later
    queryKey: [`reports`],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return reportsData;
    },
  });

  useEffect(() => {
    reset();
    setSortBy('createdAt-desc');
  }, []);

  return (
    <>
      <FiltersBar
        refetch={refetch}
        searchFilter
        searchPlaceholder="Search by report title"
        sortingEnabled
        sortByNameEnabled
        sortByDateEnabled
        dateTitle="Created at"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ReportItemSkeleton key={index} />
          ))}
        {reports &&
          reports.length > 0 &&
          reports.map((report) => (
            <ReportItem
              key={report.id}
              id={report.id}
              title={report.name}
              fileName={report.fileName}
              date={report.date}
            />
          ))}
      </div>

      <Pagination
        previousDisabled={currentPage === 1 || isLoading}
        nextDisabled={(reports && reports.length < countPerPage) || isLoading}
      />
    </>
  );
}
