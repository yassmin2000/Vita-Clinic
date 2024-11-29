'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFiltersStore } from '@/hooks/useFiltersStore';

export default function NotificationsFilters() {
  const { currentNotificationStatus, setCurrentNotificationStatus } =
    useFiltersStore();

  return (
    <Tabs
      value={currentNotificationStatus}
      onValueChange={(value) => {
        if (value !== 'all' && value !== 'unread') return;
        setCurrentNotificationStatus(value as 'all' | 'unread');
      }}
    >
      <TabsList className="flex h-full w-fit flex-wrap justify-start gap-0.5">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unread">Unread</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
