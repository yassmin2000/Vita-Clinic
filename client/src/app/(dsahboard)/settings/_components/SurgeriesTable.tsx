'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { data } from './surgeriesData';

import { DataTable } from '@/components/DataTable';
import { columns } from './LookupsColumn';

export default function SurgeriesTable() {
  const { data: surgeries, isLoading } = useQuery({
    queryKey: ['surgeries'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    },
  });

  return (
    <DataTable
      columns={columns}
      data={surgeries || []}
      isLoading={isLoading}
      pagination
      filtering
      title="Surgery"
    />
  );
}
