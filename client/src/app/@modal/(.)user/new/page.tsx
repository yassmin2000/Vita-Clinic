'use client';

import { usePathname } from 'next/navigation';

import Modal from '@/components/Modal';
import UserForm from '@/app/user/new/_components/UserForm';

export default function CrateUserModal() {
  const pathName = usePathname();

  if (pathName !== '/user/new') return null;

  return (
    <Modal>
      <UserForm />
    </Modal>
  );
}
