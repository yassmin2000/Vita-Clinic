import { redirect } from 'next/navigation';

import ProfileCard from '../_components/ProfileCard';
import { getUserRole } from '@/lib/auth';

interface UserProfilePageProps {
  params: {
    userId: string;
  };
}

export default async function UserProfilePage({
  params: { userId },
}: UserProfilePageProps) {
  const { role } = await getUserRole();

  if (!role || role === 'patient') {
    return redirect('/profile');
  }

  console.log(userId);

  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Profile
          </h2>
          <h3 className="text-base text-muted-foreground">
            View and update your profile details.
          </h3>
        </div>

        <ProfileCard userId={userId} />
      </div>
    </section>
  );
}
