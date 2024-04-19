import { redirect } from 'next/navigation';

import DeviceForm from '@/components/DeviceForm';
import { getUserRole } from '@/lib/auth';

export default async function CreateDevicePage() {
  const { role } = await getUserRole();

  if (role !== 'admin') {
    return redirect('/devices');
  }

  return (
    <div className="py-4">
      <DeviceForm />
    </div>
  );
}
