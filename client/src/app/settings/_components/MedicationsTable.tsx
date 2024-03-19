'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { data } from './medicationsData';

import { DataTable } from '@/components/DataTable';
import { columns } from './LookupsColumn';

export default function MedicationsTable() {
  const { data: medications, isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    },
  });

  return (
    <DataTable
      columns={columns}
      data={medications || []}
      isLoading={isLoading}
      pagination
      filtering
      title="Medication"
    />
  );
}
