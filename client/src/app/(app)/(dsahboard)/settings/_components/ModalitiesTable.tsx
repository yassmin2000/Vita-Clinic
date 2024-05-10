'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { columns } from './PriceLookupsColumn';
import NewEntityButton from './NewEntityButton';
import Modal from '@/components/Modal';
import PriceLookupForm from './PriceLookupForm';

import useUserRole from '@/hooks/useUserRole';
import useAccessToken from '@/hooks/useAccessToken';
import useSettingsStore from '@/hooks/useSettingsStore';

import type { PriceLookup } from '@/types/settings.type';

export default function ModalitiesTable() {
  const { role } = useUserRole();
  const accessToken = useAccessToken();

  const { data: modalities, isLoading } = useQuery({
    queryKey: ['modalities'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/modalities`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as PriceLookup[];
    },
    enabled: !!accessToken,
  });

  const { isFormOpen, closeForm, currentPriceLookup } = useSettingsStore();

  return (
    <>
      <DataTable
        columns={columns}
        data={
          modalities
            ? modalities.map((modality) => ({
                ...modality,
                type: 'modality',
                queryKey: 'modalities',
                endpoint: 'settings/modalities',
              }))
            : []
        }
        isLoading={isLoading}
        pagination
        filtering
        title="Modality"
        button={
          role === 'admin' ? <NewEntityButton title="Modality" /> : undefined
        }
      />
      <Modal isOpen={isFormOpen} onClose={closeForm} className="h-fit">
        <PriceLookupForm
          title="Modality"
          endpoint="settings/modalities"
          queryKey="modalities"
          placeholder="MRI"
          currentId={currentPriceLookup ? currentPriceLookup.id : undefined}
          defaultValues={
            currentPriceLookup
              ? {
                  name: currentPriceLookup.name,
                  description: currentPriceLookup.description,
                  price: currentPriceLookup.price,
                }
              : undefined
          }
        />
      </Modal>
    </>
  );
}
