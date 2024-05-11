import { redirect } from 'next/navigation';

import Modal from '@/components/Modal';
import UserForm from '@/components/forms/UserForm';

import { getUserRole } from '@/lib/auth';

export default async function CrateUserModal() {
  const { role } = await getUserRole();

  if (role !== 'admin') {
    return redirect('/devices');
  }

  return (
    <Modal isOpen={true}>
      <UserForm />
    </Modal>
  );
}
