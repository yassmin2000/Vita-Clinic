'use client';

import UserForm from '@/app/user/new/_components/UserForm';
import Modal from '@/components/Modal';
import { usePathname } from 'next/navigation';

export default function CrateUserModal() {
  const pathName = usePathname();

  if (pathName !== '/user/new') return null;

  return (
    <Modal>
      <UserForm />
    </Modal>
  );
}
