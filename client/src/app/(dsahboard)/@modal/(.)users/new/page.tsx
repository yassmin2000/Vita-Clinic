import Modal from '@/components/Modal';
import UserForm from '@/components/UserForm';

export default function CrateUserModal() {
  return (
    <Modal isOpen={true}>
      <UserForm />
    </Modal>
  );
}
