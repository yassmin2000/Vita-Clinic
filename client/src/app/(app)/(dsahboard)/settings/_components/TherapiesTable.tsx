'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { columns } from './TherapiesColumn';
import NewEntityButton from './NewEntityButton';
import Modal from '@/components/Modal';
import TherapyForm from './TherapyForm';

import useUserRole from '@/hooks/useUserRole';
import useAccessToken from '@/hooks/useAccessToken';
import useSettingsStore from '@/hooks/useSettingsStore';

import type { Therapy } from '@/types/settings.type';

export default function TherapiesTable() {
  const { role } = useUserRole();
  const accessToken = useAccessToken();

  const { data: therapies, isLoading } = useQuery({
    queryKey: ['therapies'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/therapies`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Therapy[];
    },
    enabled: !!accessToken,
  });

  const { isFormOpen, closeForm, currentTherapy } = useSettingsStore();

  return (
    <>
      <DataTable
        columns={columns}
        data={therapies || []}
        isLoading={isLoading}
        pagination
        filtering
        title="Therapy"
        button={
          role === 'admin' ? <NewEntityButton title="Therapy" /> : undefined
        }
      />
      <Modal isOpen={isFormOpen} onClose={closeForm} className="h-fit">
        <TherapyForm
          currentId={currentTherapy ? currentTherapy.id : undefined}
          defaultValues={
            currentTherapy
              ? {
                  name: currentTherapy.name,
                  price: currentTherapy.price,
                  unit: currentTherapy.unit,
                  description: currentTherapy.description,
                }
              : undefined
          }
        />
      </Modal>
    </>
  );
}
