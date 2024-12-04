import Link from 'next/link';
import { Bot, CalendarCheck2, CalendarX2 } from 'lucide-react';

import type { Notification } from '@/types/log.type';

export const notificationsSchemas = [
  {
    type: 'appointment_assigned',
    title: 'Appointment Assigned',
    icon: CalendarCheck2,
    message: 'You were assigned to %TARGET%.',
    action: 'View Appointment',
    href: '/appointments/:id',
    textColor: 'text-blue-700',
    backgroundColor: 'bg-blue-700/10',
  },
  {
    type: 'appointment_approved',
    title: 'Appointment Approved',
    icon: CalendarCheck2,
    message: 'Your scheduled %TARGET% was approved.',
    action: 'View Appointment',
    href: '/appointments/:id',
    textColor: 'text-blue-700',
    backgroundColor: 'bg-blue-700/10',
  },
  {
    type: 'appointment_cancelled',
    title: 'Appointment Cancelled',
    icon: CalendarX2,
    message: '%TARGET% was cancelled.',
    action: 'View Appointment',
    href: '/appointments/:id',
    textColor: 'text-red-800',
    backgroundColor: 'bg-red-800/10',
  },
  {
    type: 'appointment_rejected',
    title: 'Appointment Rejected',
    icon: CalendarX2,
    message: 'Your scheduled %TARGET% was rejected.',
    action: 'View Appointment',
    href: '/appointments/:id',
    textColor: 'text-yellow-700',
    backgroundColor: 'bg-yellow-700/10',
  },
  {
    type: 'ai_result',
    title: 'AI Analysis Result',
    icon: Bot,
    message: 'Your AI analysis result for %TARGET% is ready.',
    action: 'View Analysis',
    href: '/prediction/:id',
    textColor: 'text-yellow-700',
    backgroundColor: 'bg-yellow-700/10',
  },
];

export function formatNotificationMessage(notification: Notification) {
  const type = notification.type;
  const targetId = notification.targetId;
  const targetName = notification.targetName;

  const schema = notificationsSchemas.find(
    (noitifcation) => noitifcation.type === type
  );

  if (schema) {
    return (
      <p>
        {schema.message.split(/(%TARGET%)/).map((part, index) => {
          switch (part) {
            case '%TARGET%':
              if (schema.href)
                return (
                  <Link
                    key={index}
                    href={schema.href.replace(':id', targetId)}
                    className="font-medium text-primary transition-all hover:text-primary/80"
                  >
                    {targetName}
                  </Link>
                );
              else
                return (
                  <span key={index} className="font-medium text-primary">
                    {targetName}
                  </span>
                );
            default:
              return part;
          }
        })}
      </p>
    );
  }
}
