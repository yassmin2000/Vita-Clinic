'use client';

import { useQuery } from '@tanstack/react-query';

import { data } from './biomarkersData';

import { DataTable } from '@/components/DataTable';
import { columns } from './BiomarkersColumn';

export default function BiomarkersTable() {
  const { data: biomarkers, isLoading } = useQuery({
    queryKey: ['biomarkers'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    },
  });

  return (
    <DataTable
      columns={columns}
      data={biomarkers || []}
      isLoading={isLoading}
      pagination
      filtering
      title="Biomarker"
    />
  );
}
