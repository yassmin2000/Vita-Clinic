import { redirect } from 'next/navigation';

import Modal from '@/components/Modal';
import DeviceForm from '@/components/DeviceForm';

import { getUserRole } from '@/lib/auth';

export default async function CrateDeviceModal() {
  const { role } = await getUserRole();

  if (role !== 'admin') {
    return redirect('/devices');
  }

  return (
    <Modal isOpen={true}>
      <DeviceForm />
    </Modal>
  );
}
