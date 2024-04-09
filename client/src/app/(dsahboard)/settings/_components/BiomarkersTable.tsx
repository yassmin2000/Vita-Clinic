'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { columns } from './BiomarkersColumn';
import NewEntityButton from './NewEntityButton';
import Modal from '@/components/Modal';
import BiomarkerForm from './BiomarkerForm';

import useUserRole from '@/hooks/useUserRole';
import useAccessToken from '@/hooks/useAccessToken';
import useSettingsStore from '@/hooks/useSettingsStore';

import type { Biomarker } from '@/types/settings.type';

export default function BiomarkersTable() {
  const role = useUserRole();
  const accessToken = useAccessToken();

  const { data: biomarkers, isLoading } = useQuery({
    queryKey: ['biomarkers'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/biomarkers`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Biomarker[];
    },
  });

  const { isFormOpen, closeForm, currentBiomarker } = useSettingsStore();

  return (
    <>
      <DataTable
        columns={columns}
        data={biomarkers || []}
        isLoading={isLoading}
        pagination
        filtering
        title="Biomarker"
        button={
          role === 'admin' ? <NewEntityButton title="Biomarker" /> : undefined
        }
      />
      <Modal isOpen={isFormOpen} onClose={closeForm} className="h-fit max-w-lg">
        <BiomarkerForm
          currentId={currentBiomarker ? currentBiomarker.id : undefined}
          defaultValues={
            currentBiomarker
              ? {
                  name: currentBiomarker.name,
                  unit: currentBiomarker.unit,
                  minimumValue: currentBiomarker.minimumValue,
                  maximumValue: currentBiomarker.maximumValue,
                  description: currentBiomarker.description,
                }
              : undefined
          }
        />
      </Modal>
    </>
  );
}
