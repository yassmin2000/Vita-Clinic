import { Card } from '@/components/ui/card';
import NotificationsFilters from '@/components/notifications/NotificationsFilters';
import NotificationsList from '@/components/notifications/NotificationsList';

export default function NotificationsPage() {
  return (
    <Card className="container mx-auto max-w-screen-lg rounded-md border-none bg-card px-2 py-8 shadow-none md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-primary">Notifications</h2>
          <NotificationsFilters />
        </div>

        <NotificationsList />
      </div>
    </Card>
  );
}
