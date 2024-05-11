import { redirect } from 'next/navigation';

import UserForm from '@/components/forms/UserForm';
import { getUserRole } from '@/lib/auth';

export default async function CreateUserPage() {
  const { role } = await getUserRole();

  if (role !== 'admin') {
    return redirect('/devices');
  }

  return (
    <div className="py-4">
      <UserForm />
    </div>
  );
}
