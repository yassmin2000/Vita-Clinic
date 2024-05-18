import ProfileCard from './_components/ProfileCard';
import UpdateAvatarForm from './settings/_component/UpdateAvatarForm';
import UpdatePasswordForm from './settings/_component/UpdatePasswordForm';
import { Separator } from '@/components/ui/separator';

import { getAuthSession } from '@/lib/auth';

export default async function page() {
  const session = await getAuthSession();
  const user = session?.user;

  if (!user) {
    return null;
  }

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

        <ProfileCard />

        <Separator className="my-2 bg-primary/10" />
        <div className="flex flex-col gap-4">
          <UpdateAvatarForm
            avatar={user.avatarURL}
            firstName={user.firstName}
            lastName={user.lastName}
          />

          <UpdatePasswordForm />
        </div>
      </div>
    </section>
  );
}
