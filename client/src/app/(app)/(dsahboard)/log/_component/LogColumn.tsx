'use client';

import Link from 'next/link';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { parseISO, format, formatDistanceToNow } from 'date-fns';

import { useSession } from 'next-auth/react';
import { capitalize, cn } from '@/lib/utils';

import type { Action } from '@/types/log.type';

const actions = [
  {
    action: 'create',
    color: 'bg-green-500',
  },
  {
    action: 'update',
    color: 'bg-orange-500',
  },
  {
    action: 'delete',
    color: 'bg-red-500',
  },
  {
    action: 'approve',
    color: 'bg-blue-500',
  },
  {
    action: 'reject',
    color: 'bg-yellow-500',
  },
  {
    action: 'rejected',
    color: 'bg-yellow-500',
  },
  {
    action: 'cancel',
    color: 'bg-red-500',
  },
  {
    action: 'complete',
    color: 'bg-green-500',
  },
  {
    action: 'activate',
    color: 'bg-green-500',
  },
  {
    action: 'deactivate',
    color: 'bg-red-500',
  },
];

const actionsSchema = [
  {
    type: 'admin',
    actions: [
      {
        action: 'create',
        message: '%USER% created new admin: %TARGET%',
        href: '/profile/:id',
      },
    ],
  },
  {
    type: 'doctor',
    actions: [
      {
        action: 'create',
        message: '%USER% created new doctor: %TARGET%',
        href: '/profile/:id',
      },
    ],
  },
  {
    type: 'patient',
    actions: [
      {
        action: 'create',
        message: '%USER% created new patient: %TARGET%',
        href: '/profile/:id',
      },
    ],
  },
  {
    type: 'user',
    actions: [
      {
        action: 'activate',
        message: '%USER% activated user: %TARGET%',
        href: '/profile/:id',
      },
      {
        action: 'deactivate',
        message: '%USER% deactivated user: %TARGET%',
        href: '/profile/:id',
      },
    ],
  },
  {
    type: 'device',
    actions: [
      {
        action: 'create',
        message: '%USER% created new device: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated device: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted device: %TARGET%',
      },
    ],
  },
  {
    type: 'allergy',
    actions: [
      {
        action: 'create',
        message: '%USER% created new allergy: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated allergy: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted allergy: %TARGET%',
      },
    ],
  },
  {
    type: 'diagnosis',
    actions: [
      {
        action: 'create',
        message: '%USER% created new diagnosis: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated diagnosis: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted diagnosis: %TARGET%',
      },
    ],
  },
  {
    type: 'medication-condition',
    actions: [
      {
        action: 'create',
        message: '%USER% created new medication condition: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated medication condition: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted medication condition: %TARGET%',
      },
    ],
  },
  {
    type: 'medication',
    actions: [
      {
        action: 'create',
        message: '%USER% created new medication: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated medication: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted medication: %TARGET%',
      },
    ],
  },
  {
    type: 'surgery',
    actions: [
      {
        action: 'create',
        message: '%USER% created new surgery: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated surgery: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted surgery: %TARGET%',
      },
    ],
  },
  {
    type: 'modality',
    actions: [
      {
        action: 'create',
        message: '%USER% created new modality: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated modality: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted modality: %TARGET%',
      },
    ],
  },
  {
    type: 'biomarker',
    actions: [
      {
        action: 'create',
        message: '%USER% created new biomarker: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated biomarker: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted biomarker: %TARGET%',
      },
    ],
  },
  {
    type: 'laboratory-test',
    actions: [
      {
        action: 'create',
        message: '%USER% created new laboratory test: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated laboratory test: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted laboratory test: %TARGET%',
      },
    ],
  },
  {
    type: 'service',
    actions: [
      {
        action: 'create',
        message: '%USER% created new service: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated service: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted service: %TARGET%',
      },
    ],
  },
  {
    type: 'therapy',
    actions: [
      {
        action: 'create',
        message: '%USER% created new therapy: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated therapy: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted therapy: %TARGET%',
      },
    ],
  },
  {
    type: 'speciality',
    actions: [
      {
        action: 'create',
        message: '%USER% created new speciality: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated speciality: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted speciality: %TARGET%',
      },
    ],
  },
  {
    type: 'doctor-speciality',
    actions: [
      {
        action: 'update',
        message: '%USER% updated speciality of Dr. %USERTARGET% to %TARGET%',
      },
    ],
  },
  {
    type: 'manufacturer',
    actions: [
      {
        action: 'create',
        message: '%USER% created new manufacturer: %TARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated manufacturer: %TARGET%',
      },
      {
        action: 'delete',
        message: '%USER% deleted manufacturer: %TARGET%',
      },
    ],
  },
  {
    type: 'patient-general',
    actions: [
      {
        action: 'update',
        message: '%USER% updated general information for %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
    ],
  },
  {
    type: 'patient-allergy',
    actions: [
      {
        action: 'create',
        message: '%USER% created new allergy (%TARGET%) for %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
      {
        action: 'update',
        message: '%USER% updated allergy %TARGET% details for %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
      {
        action: 'delete',
        message: '%USER% deleted allergy %TARGET% from %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
    ],
  },
  {
    type: 'patient-diagnosis',
    actions: [
      {
        action: 'create',
        message: '%USER% created new diagnosis (%TARGET%) for %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
      {
        action: 'update',
        message:
          '%USER% updated diagnosis %TARGET% details for %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
      {
        action: 'delete',
        message: '%USER% deleted diagnosis %TARGET% from %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
    ],
  },
  {
    type: 'patient-medical-condition',
    actions: [
      {
        action: 'create',
        message:
          '%USER% created new medical condition (%TARGET%) for %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
      {
        action: 'update',
        message:
          '%USER% updated medical condition %TARGET% details for %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
      {
        action: 'delete',
        message:
          '%USER% deleted medical condition %TARGET% from %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
    ],
  },
  {
    type: 'patient-surgery',
    actions: [
      {
        action: 'create',
        message: '%USER% created new surgery (%TARGET%) for %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
      {
        action: 'update',
        message: '%USER% updated surgery %TARGET% details for %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
      {
        action: 'delete',
        message: '%USER% deleted surgery %TARGET% from %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
    ],
  },
  {
    type: 'patient-medication',
    actions: [
      {
        action: 'create',
        message:
          '%USER% created new medication (%TARGET%) for %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
      {
        action: 'update',
        message:
          '%USER% updated medication %TARGET% details for %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
      {
        action: 'delete',
        message: '%USER% deleted medication %TARGET% from %USERTARGET% EMR',
        href: '/patients/:id/emr',
      },
    ],
  },
  {
    type: 'insurance',
    actions: [
      {
        action: 'create',
        message: '%USER% created new insurance from %TARGET% for %USERTARGET%',
        href: '/patients/:id/emr',
      },
      {
        action: 'update',
        message: '%USER% updated %TARGET% details for %USERTARGET%',
        href: '/patients/:id/emr',
      },
      {
        action: 'delete',
        message: '%USER% deleted %TARGET% from %USERTARGET%',
        href: '/patients/:id/emr',
      },
    ],
  },
  {
    type: 'appointment',
    actions: [
      {
        action: 'approve',
        message: '%USER% approved %TARGET% by %USERTARGET%',
        href: '/appointments/:id',
      },
      {
        action: 'reject',
        message: '%USER% rejected %TARGET% by %USERTARGET%',
        href: '/appointments/:id',
      },
      {
        action: 'rejected',
        message: '%USER% rejected %TARGET% by %USERTARGET%',
        href: '/appointments/:id',
      },
      {
        action: 'cancel',
        message: '%USER% cancelled %TARGET% by %USERTARGET%',
        href: '/appointments/:id',
      },
      {
        action: 'complete',
        message: '%USER% completed %TARGET% by %USERTARGET%',
        href: '/appointments/:id',
      },
    ],
  },
  {
    type: 'report',
    actions: [
      {
        action: 'create',
        message: '%USER% created new report %TARGET% for %USERTARGET%',
        href: '/reports/:id',
      },
      {
        action: 'update',
        message: '%USER% updated report %TARGET% details for %USERTARGET%',
        href: '/reports/:id',
      },
    ],
  },
  {
    type: 'scan',
    actions: [
      {
        action: 'create',
        message: '%USER% created new scan %TARGET% for %USERTARGET%',
        href: '/scans/:id',
      },
      {
        action: 'update',
        message: '%USER% updated scan %TARGET% details for %USERTARGET%',
        href: '/scans/:id',
      },
    ],
  },
  {
    type: 'prescription',
    actions: [
      {
        action: 'create',
        message: '%USER% prescribed new medication %TARGET% for %USERTARGET%',
      },
      {
        action: 'update',
        message:
          '%USER% updated prescription %TARGET% details for %USERTARGET%',
      },
    ],
  },
  {
    type: 'treatment',
    actions: [
      {
        action: 'create',
        message: '%USER% created new treatment %TARGET% for %USERTARGET%',
      },
      {
        action: 'update',
        message: '%USER% updated treatment %TARGET% details for %USERTARGET%',
      },
    ],
  },
  {
    type: 'laboratory-test-results',

    actions: [
      {
        action: 'create',
        message:
          '%USER% created new laboratory test results %TARGET% for %USERTARGET%',
      },
      {
        action: 'update',
        message:
          '%USER% updated laboratory test results %TARGET% details for %USERTARGET%',
      },
    ],
  },
];

const DetailsCell = ({ row }: { row: Row<Action> }) => {
  const type = row.original.type;
  const action = row.original.action;
  const user = row.original.user;
  const targetId = row.original.targetId;
  const targetName = row.original.targetName;
  const targetUser = row.original.targetUser;
  const session = useSession();

  const schema = actionsSchema.find((schema) => schema.type === type);

  if (schema) {
    const currentAction = schema.actions.find((a) => a.action === action) as
      | {
          action: string;
          message: string;
          href?: string;
        }
      | undefined;

    if (currentAction) {
      return (
        <p>
          {currentAction.message
            .split(/(%USER%|%TARGET%|%USERTARGET%)/)
            .map((part, index) => {
              switch (part) {
                case '%USER%':
                  if (user.id === session.data?.user.id)
                    return (
                      <span key={index} className="font-medium text-primary">
                        You
                      </span>
                    );
                  else
                    return (
                      <Link
                        key={index}
                        href={`/profile/${user.id}`}
                        className="font-medium text-primary transition-all hover:text-primary/80"
                      >
                        {`${user.role === 'doctor' ? 'Dr. ' : ''}${user.firstName} ${user.lastName}`}
                      </Link>
                    );
                case '%TARGET%':
                  if (currentAction.href)
                    return (
                      <Link
                        key={index}
                        href={currentAction.href.replace(':id', targetId)}
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
                case '%USERTARGET%':
                  return (
                    <Link
                      key={index}
                      href={`/profile/${targetUser?.id}`}
                      className="font-medium text-primary transition-all hover:text-primary/80"
                    >
                      {`${targetUser?.firstName} ${targetUser?.lastName}`}
                    </Link>
                  );
                default:
                  return part;
              }
            })}
        </p>
      );
    }

    return null;
  }

  return null;
};

export const columns: ColumnDef<Action>[] = [
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => {
      const action = row.original.action;
      const schema = actions.find((a) => a.action === action);

      return (
        <div className="flex items-center gap-3">
          <div className={cn('h-4 w-4 rounded-full', schema?.color)} />
          <span>{capitalize(action)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined at',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;

      return (
        <div className="flex flex-col whitespace-nowrap">
          <span>{format(parseISO(createdAt), 'MMM dd, yyyy')}</span>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(parseISO(createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      );
    },
  },
  {
    header: 'Details',
    cell: DetailsCell,
  },
];
