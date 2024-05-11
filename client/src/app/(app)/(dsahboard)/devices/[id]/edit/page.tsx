import { redirect } from 'next/navigation';

import DeviceForm from '@/components/forms/DeviceForm';
import { getUserRole } from '@/lib/auth';

interface EditDevicePageProps {
  params: {
    id: string;
  };
}

export default async function EditDevicePage({
  params: { id },
}: EditDevicePageProps) {
  const { role } = await getUserRole();

  if (role !== 'admin') {
    return redirect('/devices');
  }

  return (
    <div className="py-4">
      <DeviceForm deviceId={id} />
    </div>
  );
}
