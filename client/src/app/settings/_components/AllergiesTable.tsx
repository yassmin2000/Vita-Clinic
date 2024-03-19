'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { data } from './allergiesData';

import { DataTable } from '@/components/DataTable';
import { columns } from './LookupsColumn';

export default function AllergiesTable() {
  const { data: allergies, isLoading } = useQuery({
    queryKey: ['allergies'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    },
  });

  return (
    <DataTable
      columns={columns}
      data={allergies || []}
      isLoading={isLoading}
      pagination
      filtering
      title="Allergy"
    />
  );
}
