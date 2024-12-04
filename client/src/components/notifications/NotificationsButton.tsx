import { Bell } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import NotificationsList from '@/components/notifications/NotificationsList';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

import { useNotifications } from '@/context/NotificationsProvider';

export default function NotificationsButton() {
  const { count, newNotifications } = useNotifications();
  const totalCount =
    count +
    newNotifications.filter((notification) => !notification.isRead).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <div className="relative">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {totalCount > 0 && (
              <Badge className="absolute -right-1 -top-1.5 flex h-4 w-4 items-center justify-center bg-destructive p-0 hover:bg-destructive">
                {totalCount}
              </Badge>
            )}
          </div>
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-h-[400px] overflow-y-auto px-0 py-0"
      >
        <NotificationsList isPopover />
      </PopoverContent>
    </Popover>
  );
}
