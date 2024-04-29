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

export default function ServicesTable() {
  const { role } = useUserRole();
  const accessToken = useAccessToken();

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/services`,
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
        data={services || []}
        isLoading={isLoading}
        pagination
        filtering
        title="Service"
        button={
          role === 'admin' ? <NewEntityButton title="Service" /> : undefined
        }
      />
      <Modal isOpen={isFormOpen} onClose={closeForm} className="h-fit">
        <PriceLookupForm
          title="Service"
          endpoint="settings/services"
          queryKey="services"
          placeholder="Consultation"
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
