'use client';

import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useIntersection } from '@mantine/hooks';

import NotificationListItem from './NotificationListItem';
import NotificationItemSkeleton from './NotificationItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import { useNotifications } from '@/context/NotificationsProvider';
import { useFiltersStore } from '@/hooks/useFiltersStore';
import { cn } from '@/lib/utils';

import type { Notification } from '@/types/log.type';

interface NotificationsListProps {
  isPopover?: boolean;
}

export default function NotificationsList({
  isPopover = false,
}: NotificationsListProps) {
  const { newNotifications } = useNotifications();
  const { ref, entry } = useIntersection({
    threshold: 1,
  });
  const { currentNotificationStatus } = useFiltersStore();
  const accessToken = useAccessToken();

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [
        `notifications_${isPopover ? 'all' : currentNotificationStatus}`,
      ],
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications?page=${pageParam}&limit=5&status=${isPopover ? 'all' : currentNotificationStatus}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data as Notification[];
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.length === 5 ? allPages.length + 1 : undefined;
        return nextPage;
      },
      enabled: !!accessToken,
    });

  const uniqueNotifications = new Set<string>();

  const combinedNotifications = [
    ...newNotifications,
    ...(data?.pages.flat() || []),
  ];

  const filteredNotifications = combinedNotifications
    .filter((notification) => {
      if (uniqueNotifications.has(notification.id)) {
        return false;
      } else {
        uniqueNotifications.add(notification.id);
        return true;
      }
    })
    .filter((notification) => {
      if (isPopover || currentNotificationStatus === 'all') {
        return true;
      }
      return !notification.isRead;
    });

  const notifications = filteredNotifications.map((notification, index) => {
    if (filteredNotifications.length == index + 1) {
      return (
        <NotificationListItem
          key={notification.id}
          ref={ref}
          isPopover={isPopover}
          notification={notification}
        />
      );
    }
    return (
      <NotificationListItem
        key={notification.id}
        isPopover={isPopover}
        notification={notification}
      />
    );
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, fetchNextPage]);

  return (
    <div className={cn('flex flex-col gap-0', !isPopover && 'gap-2')}>
      {notifications}
      {(isLoading || isFetchingNextPage) &&
        Array.from({ length: 3 }).map((_, index) => (
          <NotificationItemSkeleton key={index} isPopover={isPopover} />
        ))}
      {!isLoading && !isFetchingNextPage && notifications.length === 0 && (
        <div className="py-2 text-center text-muted-foreground">
          No notifications found
        </div>
      )}
    </div>
  );
}
