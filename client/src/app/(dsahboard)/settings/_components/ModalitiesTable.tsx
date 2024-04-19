'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { columns } from './BiomarkersColumn';
import NewEntityButton from './NewEntityButton';
import Modal from '@/components/Modal';
import ModalityForm from './ModalityForm';

import useUserRole from '@/hooks/useUserRole';
import useAccessToken from '@/hooks/useAccessToken';
import useSettingsStore from '@/hooks/useSettingsStore';

import type { Biomarker } from '@/types/settings.type';
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

      return response.data as Biomarker[];
    },
    enabled: !!accessToken,
  });

  const { isFormOpen, closeForm, currentModality } = useSettingsStore();

  return (
    <>
      <DataTable
        columns={columns}
        data={modalities || []}
        isLoading={isLoading}
        pagination
        filtering
        title="Modality"
        button={
          role === 'admin' ? <NewEntityButton title="Modality" /> : undefined
        }
      />
      <Modal isOpen={isFormOpen} onClose={closeForm} className="h-fit">
        <ModalityForm
          currentId={currentModality ? currentModality.id : undefined}
          defaultValues={
            currentModality
              ? {
                  name: currentModality.name,
                  description: currentModality.description,
                  price: currentModality.price,
                }
              : undefined
          }
        />
      </Modal>
    </>
  );
}
