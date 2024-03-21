'use client';

import { useQuery } from '@tanstack/react-query';

import { data } from './laboratoryTestsData';

import { DataTable } from '@/components/DataTable';
import { columns } from './LaboratoryTestsColumn';

export default function LaboratoryTestsTable() {
  const { data: laboratoryTests, isLoading } = useQuery({
    queryKey: ['laboratory-tests'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    },
  });

  return (
    <DataTable
      columns={columns}
      data={laboratoryTests || []}
      isLoading={isLoading}
      pagination
      filtering
      title="Laboratory Test"
    />
  );
}
