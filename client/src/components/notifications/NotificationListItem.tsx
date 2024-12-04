'use client';

import { forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useNotifications } from '@/context/NotificationsProvider';
import useAccessToken from '@/hooks/useAccessToken';
import {
  formatNotificationMessage,
  notificationsSchemas,
} from '@/lib/notifications';
import { cn } from '@/lib/utils';

import type { Notification } from '@/types/log.type';

interface NotificationListItemProps {
  notification: Notification;
  isPopover?: boolean;
}

const NotificationListItem = forwardRef<
  HTMLDivElement,
  NotificationListItemProps
>(({ notification, isPopover = false }, ref) => {
  const { markAsRead: markNotificationAsRead } = useNotifications();
  const accessToken = useAccessToken();
  const router = useRouter();

  const { mutate: markAsRead, isPending } = useMutation({
    mutationFn: async () => {
      return await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notification.id}/read`,
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      markNotificationAsRead(notification.id);
    },
  });

  const notificationSchema = notificationsSchemas.find(
    (schema) => schema.type === notification.type
  );

  if (!notificationSchema) return null;

  return (
    <Card
      ref={ref}
      className={cn(
        'flex items-center justify-between border-black/5 p-4 dark:border-gray-800',
        isPopover &&
          'w-full rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-1.5 py-2 shadow-none last:border-b-0',
        !notification.isRead && 'bg-primary/5'
      )}
    >
      <div
        className={cn(
          'flex w-full flex-col items-center justify-between gap-1 sm:flex-row',
          isPopover && 'sm:flex-col'
        )}
      >
        <div className="flex items-center gap-x-4">
          <div
            className={cn(
              'w-fit rounded-full p-2',
              notificationSchema.backgroundColor
            )}
          >
            <notificationSchema.icon
              className={cn(
                'h-8 w-8',
                notificationSchema.textColor,
                isPopover && 'h-6 w-6'
              )}
            />
          </div>
          <div className={cn('flex flex-col', isPopover && 'text-sm')}>
            <p className="font-medium">
              {formatNotificationMessage(notification)}
            </p>
            <p
              className={cn(
                'text-sm text-muted-foreground',
                isPopover && 'text-xs'
              )}
            >
              {formatDistanceToNow(parseISO(notification.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        <Button
          size="xs"
          className={cn('self-end sm:self-center', isPopover && 'sm:self-end')}
          disabled={isPending}
          onClick={() => {
            if (!notification.isRead) {
              markAsRead();
            }

            if (notificationSchema.href) {
              router.push(
                notificationSchema.href.replace(':id', notification.targetId)
              );
            }
          }}
        >
          {notificationSchema.action}
        </Button>
      </div>
    </Card>
  );
});

NotificationListItem.displayName = 'NotificationListItem';

export default NotificationListItem;
