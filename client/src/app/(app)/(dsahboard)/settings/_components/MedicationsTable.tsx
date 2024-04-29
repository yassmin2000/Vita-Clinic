'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { columns } from './MedicationColumn';
import NewEntityButton from './NewEntityButton';
import Modal from '@/components/Modal';
import MedicationForm from './MedicationForm';

import useAccessToken from '@/hooks/useAccessToken';
import useSettingsStore from '@/hooks/useSettingsStore';

import type { Medication } from '@/types/settings.type';

export default function MedicationsTable() {
  const accessToken = useAccessToken();

  const { data: medications, isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/medications`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Medication[];
    },
    enabled: !!accessToken,
  });

  const { isFormOpen, closeForm, currentMedication } = useSettingsStore();

  return (
    <>
      <DataTable
        columns={columns}
        data={medications || []}
        isLoading={isLoading}
        pagination
        filtering
        title="Medication"
        button={<NewEntityButton title="Medication" />}
      />
      <Modal isOpen={isFormOpen} onClose={closeForm} className="h-fit">
        <MedicationForm
          currentId={currentMedication ? currentMedication.id : undefined}
          defaultValues={
            currentMedication
              ? {
                  name: currentMedication.name,
                  description: currentMedication.description,
                  strength: currentMedication.strength,
                  unit: currentMedication.unit,
                  dosageForm: currentMedication.dosageForm,
                  routeOfAdministration:
                    currentMedication.routeOfAdministration,
                }
              : undefined
          }
        />
      </Modal>
    </>
  );
}
