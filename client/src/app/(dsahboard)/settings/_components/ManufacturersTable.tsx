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

export default function ManufacturersTable() {
  const accessToken = useAccessToken();

  const { data: allergies, isLoading } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/manufacturers`,
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
        data={allergies || []}
        isLoading={isLoading}
        pagination
        filtering
        title="Manufacturer"
        button={<NewEntityButton title="Manufacturer" />}
      />
      <Modal isOpen={isFormOpen} onClose={closeForm} className="h-fit max-w-lg">
        <LookupForm
          title="Manufacturer"
          endpoint="settings/manufacturers"
          queryKey="manufacturers"
          placeholder="Siemens"
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
