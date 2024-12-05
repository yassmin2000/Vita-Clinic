import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { BellIcon } from 'lucide-react';

import useAccessToken from '@/hooks/useAccessToken';
import type { Notification } from '@/types/log.type';
import {
  formatNotificationMessage,
  notificationsSchemas,
} from '@/lib/notifications';

const NotificationsContext = createContext<{
  count: number;
  setCount: (count: number) => void;
  newNotifications: Notification[];
  markAsRead: (notificationId: string) => void;
}>({
  count: 0,
  setCount: () => {},
  newNotifications: [],
  markAsRead: () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

export default function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [count, setCount] = useState(0);
  const [newNotifications, setNewNotifications] = useState<Notification[]>([]);
  const router = useRouter();
  const accessToken = useAccessToken();

  useQuery({
    queryKey: ['notifications_count'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/count`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as { count: number };

      if (data) {
        setCount(data.count);
      }

      return data;
    },
    enabled: !!accessToken,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Connect to WebSocket on component mount
  useEffect(() => {
    if (accessToken) {
      const newSocket = io(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/notifications`,
        {
          query: { token: accessToken }, // Include JWT if required
        }
      );

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [accessToken]);

  // Listen for new notifications and append them
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (newNotification: Notification) => {
      const notificationSchema = notificationsSchemas.find(
        (notification) => notification.type === newNotification.type
      );
      if (!notificationSchema) return;

      toast(notificationSchema.title, {
        id: newNotification.id,
        description: formatNotificationMessage(newNotification),
        icon: notificationSchema.icon ? (
          <notificationSchema.icon />
        ) : (
          <BellIcon />
        ),
        action: notificationSchema.href
          ? {
              label: notificationSchema.action,
              onClick: () =>
                router.push(
                  notificationSchema.href.replace(
                    ':id',
                    newNotification.targetId
                  )
                ),
            }
          : undefined,
      });

      setNewNotifications((notifications) => {
        const notificationsMap = new Map(
          notifications.map((notification) => [notification.id, notification])
        );
        notificationsMap.set(newNotification.id, newNotification);
        return Array.from(notificationsMap.values());
      });
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket]);

  return (
    <NotificationsContext.Provider
      value={{
        count,
        setCount,
        newNotifications,
        markAsRead: (notificationId) => {
          setNewNotifications((notifications) => {
            return notifications.map((notification) => {
              if (notification.id === notificationId) {
                return { ...notification, isRead: true };
              }
              return notification;
            });
          });
        },
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
