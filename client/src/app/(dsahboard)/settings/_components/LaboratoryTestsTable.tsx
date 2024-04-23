'use client';

import { useQuery } from '@tanstack/react-query';

import { data } from './laboratoryTestsData';

import { DataTable } from '@/components/DataTable';
import { columns } from './LaboratoryTestsColumn';
import useUserRole from '@/hooks/useUserRole';
import useAccessToken from '@/hooks/useAccessToken';
import useSettingsStore from '@/hooks/useSettingsStore';
import NewEntityButton from './NewEntityButton';
import Modal from '@/components/Modal';
import LaboratoryTestForm from './LaboratoryTestForm';

export default function LaboratoryTestsTable() {
  const { role } = useUserRole();
  const accessToken = useAccessToken();

  const { data: laboratoryTests, isLoading } = useQuery({
    queryKey: ['laboratory-tests'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data;
    },
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
                  biomarkers: currentLaboratoryTest.biomarkers,
                }
              : undefined
          }
        />
      </Modal>
    </>
  );
}
