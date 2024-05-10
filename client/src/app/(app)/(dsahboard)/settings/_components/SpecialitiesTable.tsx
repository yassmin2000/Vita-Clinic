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

export default function SpecialitiesTable() {
  const accessToken = useAccessToken();

  const { data: specialities, isLoading } = useQuery({
    queryKey: ['specialities'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/specialities`,
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
          specialities
            ? specialities.map((speciality) => ({
                ...speciality,
                type: 'speciality',
                queryKey: 'specialities',
                endpoint: 'settings/specialities',
              }))
            : []
        }
        isLoading={isLoading}
        pagination
        filtering
        title="Speciality"
        button={<NewEntityButton title="Speciality" />}
      />
      <Modal isOpen={isFormOpen} onClose={closeForm} className="h-fit">
        <LookupForm
          title="Speciality"
          endpoint="settings/specialities"
          queryKey="specialities"
          placeholder="Cardiology"
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
