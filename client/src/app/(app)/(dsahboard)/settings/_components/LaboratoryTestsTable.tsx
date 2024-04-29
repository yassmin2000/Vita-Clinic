'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/DataTable';
import { columns } from './LaboratoryTestsColumn';
import useUserRole from '@/hooks/useUserRole';
import useAccessToken from '@/hooks/useAccessToken';
import useSettingsStore from '@/hooks/useSettingsStore';
import NewEntityButton from './NewEntityButton';
import Modal from '@/components/Modal';
import LaboratoryTestForm from './LaboratoryTestForm';

import type { LaboratoryTest } from '@/types/settings.type';

export default function LaboratoryTestsTable() {
  const { role } = useUserRole();
  const accessToken = useAccessToken();

  const { data: laboratoryTests, isLoading } = useQuery({
    queryKey: ['laboratory-tests'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/laboratory-tests`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as LaboratoryTest[];
    },
    enabled: !!accessToken,
  });

  const { isFormOpen, closeForm, currentLaboratoryTest } = useSettingsStore();

  return (
    <>
      <DataTable
        columns={columns}
        data={laboratoryTests || []}
        isLoading={isLoading}
        pagination
        filtering
        title="Laboratory Test"
        button={
          role === 'admin' ? (
            <NewEntityButton title="Laboratory Test" />
          ) : undefined
        }
      />

      <Modal isOpen={isFormOpen} onClose={closeForm} className="h-fit">
        <LaboratoryTestForm
          currentId={
            currentLaboratoryTest ? currentLaboratoryTest.id : undefined
          }
          defaultValues={
            currentLaboratoryTest
              ? {
                  name: currentLaboratoryTest.name,
                  description: currentLaboratoryTest.description,
                  price: currentLaboratoryTest.price,
                  biomarkers: currentLaboratoryTest.biomarkers.map(
                    (biomarker) => ({
                      label: biomarker.name,
                      value: biomarker.id,
                    })
                  ),
                }
              : undefined
          }
        />
      </Modal>
    </>
  );
}
