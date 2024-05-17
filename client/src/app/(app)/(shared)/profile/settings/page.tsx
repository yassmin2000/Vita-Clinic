import UpdateAvatarForm from './_component/UpdateAvatarForm';
import UpdatePasswordForm from './_component/UpdatePasswordForm';
import { Separator } from '@/components/ui/separator';

import { getAuthSession } from '@/lib/auth';

export default async function UserSettingsPage() {
  const session = await getAuthSession();
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <div className="py-4">
      <div className="mx-auto h-full max-w-3xl space-y-2 p-4">
        <div className="w-full">
          <div>
            <h3 className="text-2xl font-bold">Your Settings</h3>
            <p className="text-base text-muted-foreground">
              Manage your account settings here
            </p>
          </div>
          <Separator className="mt-2 bg-primary/10" />
          <div className="mt-6 flex flex-col gap-4">
            <UpdateAvatarForm
              avatar={user.avatarURL}
              firstName={user.firstName}
              lastName={user.lastName}
            />

            <UpdatePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
