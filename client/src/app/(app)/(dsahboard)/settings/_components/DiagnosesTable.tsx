'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { columns } from './LookupsColumn';
import NewEntityButton from './NewEntityButton';
import Modal from '@/components/Modal';
import LookupForm from './LookupForm';

import useAccessToken from '@/hooks/useAccessToken';
import useSettingsStore from '@/hooks/useSettingsStore';

import type { Lookup } from '@/types/settings.type';

export default function DiagnosesTable() {
  const accessToken = useAccessToken();

  const { data: diagnoses, isLoading } = useQuery({
    queryKey: ['diagnoses'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/diagnoses`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Lookup[];
    },
    enabled: !!accessToken,
  });

  const { isFormOpen, closeForm, currentLookup } = useSettingsStore();

  return (
    <>
      <DataTable
        columns={columns}
        data={
          diagnoses
            ? diagnoses.map((diagnosis) => ({
                ...diagnosis,
                type: 'diagnosis',
                queryKey: 'diagnoses',
                endpoint: 'settings/diagnoses',
              }))
            : []
        }
        isLoading={isLoading}
        pagination
        filtering
        title="Diagnosis"
        button={<NewEntityButton title="Diagnosis" />}
      />
      <Modal isOpen={isFormOpen} onClose={closeForm} className="h-fit">
        <LookupForm
          title="Diagnosis"
          endpoint="settings/diagnoses"
          queryKey="diagnoses"
          placeholder="Breast Cancer"
          currentId={currentLookup ? currentLookup.id : undefined}
          defaultValues={
            currentLookup
              ? {
                  name: currentLookup.name,
                  description: currentLookup.description,
                }
              : undefined
          }
        />
      </Modal>
    </>
  );
}
