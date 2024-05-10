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

export default function MedicalConditionsTable() {
  const accessToken = useAccessToken();

  const {
    data: medicalConditions,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['medical-conditions'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/medical-conditions`,
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
          medicalConditions
            ? medicalConditions.map((medicalCondition) => ({
                ...medicalCondition,
                type: 'medical-condition',
                queryKey: 'medical-conditions',
                endpoint: 'settings/medical-conditions',
              }))
            : []
        }
        isLoading={isLoading}
        pagination
        filtering
        title="Medical Condition"
        button={<NewEntityButton title="Medical Condition" />}
      />
      <Modal isOpen={isFormOpen} onClose={closeForm} className="h-fit">
        <LookupForm
          title="Medical Condition"
          endpoint="settings/medical-conditions"
          queryKey="medical-conditions"
          placeholder="Asthma"
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
