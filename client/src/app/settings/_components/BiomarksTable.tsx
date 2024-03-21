'use client';

import { useQuery } from '@tanstack/react-query';

import { data } from './biomarksData';

import { DataTable } from '@/components/DataTable';
import { columns } from './BiomarksColumn';

export default function BiomarksTable() {
  const { data: biomarks, isLoading } = useQuery({
    queryKey: ['biomarks'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    },
  });

  return (
    <DataTable
      columns={columns}
      data={biomarks || []}
      isLoading={isLoading}
      pagination
      filtering
      title="Biomark"
    />
  );
}
