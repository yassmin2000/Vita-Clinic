import DeviceForm from '@/components/DeviceForm';

interface EditDevicePageProps {
  params: {
    id: string;
  };
}

export default function EditDevicePage({
  params: { id },
}: EditDevicePageProps) {
  return (
    <div className="py-4">
      <DeviceForm deviceId={id} />
    </div>
  );
}
