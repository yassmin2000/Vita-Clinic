'use client';

import { useQuery } from '@tanstack/react-query';

import { data } from './medicalConditionsData';

import { DataTable } from '@/components/DataTable';
import { columns } from './LookupsColumn';

export default function MedicalConditionsTable() {
  const {
    data: medicalConditions,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['medical-conditions'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    },
  });

  return (
    <DataTable
      columns={columns}
      data={medicalConditions || []}
      isLoading={isLoading}
      pagination
      filtering
      title="Medical Condition"
    />
  );
}
