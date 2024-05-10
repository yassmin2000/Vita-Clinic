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

export default function AllergiesTable() {
  const accessToken = useAccessToken();

  const { data: allergies, isLoading } = useQuery({
    queryKey: ['allergies'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/allergies`,
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
          allergies
            ? allergies.map((allergy) => ({
                ...allergy,
                type: 'allergy',
                queryKey: 'allergies',
                endpoint: 'settings/allergies',
              }))
            : []
        }
        isLoading={isLoading}
        pagination
        filtering
        title="Allergy"
        button={<NewEntityButton title="Allergy" />}
      />
      <Modal isOpen={isFormOpen} onClose={closeForm} className="h-fit">
        <LookupForm
          title="Allergy"
          endpoint="settings/allergies"
          queryKey="allergies"
          placeholder="Milk Allergy"
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
