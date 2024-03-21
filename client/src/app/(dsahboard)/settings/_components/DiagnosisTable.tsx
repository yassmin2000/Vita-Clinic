'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { data } from './diagnosisData';

import { DataTable } from '@/components/DataTable';
import { columns } from './LookupsColumn';

export default function DiagnosisTable() {
  const {
    data: diagnosis,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['diagnosis'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    },
  });

  return (
    <DataTable
      columns={columns}
      data={diagnosis || []}
      isLoading={isLoading}
      pagination
      filtering
      title="Diagnosis"
    />
  );
}
