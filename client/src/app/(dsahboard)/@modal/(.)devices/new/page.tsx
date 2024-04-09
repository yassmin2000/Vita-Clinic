import Modal from '@/components/Modal';
import DeviceForm from '@/components/DeviceForm';

export default function CrateDeviceModal() {
  return (
    <Modal isOpen={true}>
      <DeviceForm />
    </Modal>
  );
}
