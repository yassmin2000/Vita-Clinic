'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { data } from './modalitiesData';

import { DataTable } from '@/components/DataTable';
import { columns } from './ModalitiesColumn';

export default function ModalitiesTable() {
  const { data: modalities, isLoading } = useQuery({
    queryKey: ['modalities'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    },
  });

  return (
    <DataTable
      columns={columns}
      data={modalities || []}
      isLoading={isLoading}
      pagination
      filtering
      title="Modality"
    />
  );
}
