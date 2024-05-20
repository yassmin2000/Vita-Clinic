'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { useQueryClient } from '@tanstack/react-query';
import {
  differenceInYears,
  parseISO,
  format,
  formatDistanceToNow,
} from 'date-fns';
import {
  Ban,
  Eye,
  MoreHorizontal,
  Pencil,
  ShieldMinus,
  ShieldPlus,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ActivateModal from '@/components/ActivateModal';
import DeactivateModal from '@/components/DeactivateModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import useUserRole from '@/hooks/useUserRole';
import { useTableOptions } from '@/hooks/useTableOptions';

import type { Doctor } from '@/types/users.type';
import Modal from '@/components/Modal';
import SpecialityForm from './SpecialityForm';

const ActionsCell = ({ row }: { row: Row<Doctor> }) => {
  const { role, isSuperAdmin } = useUserRole();

  const userId = row.original.id;
  const isActive = row.original.isActive;
  const [isActivating, setIsActivating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isChangingSpeciality, setIsChangingSpeciality] = useState(false);

  const queryClient = useQueryClient();
  const {
    sortBy,
    searchValue,
    currentGender,
    currentStatus,
    currentPage,
    countPerPage,
  } = useTableOptions();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Link href={`/profile/${row.original.id}`}>
            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" /> View Profile
              </div>
            </DropdownMenuItem>
          </Link>
          {role === 'admin' && (
            <DropdownMenuItem onClick={() => setIsChangingSpeciality(true)}>
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4" /> Change Speciality
              </div>
            </DropdownMenuItem>
          )}
          {isSuperAdmin && (
            <>
              <DropdownMenuSeparator />
              {isActive ? (
                <DropdownMenuItem onClick={() => setIsDeactivating(true)}>
                  <div className="flex items-center gap-2">
                    <ShieldMinus className="h-4 w-4" /> Deactivate
                  </div>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => setIsActivating(true)}>
                  <div className="flex items-center gap-2">
                    <ShieldPlus className="h-4 w-4" /> Activate
                  </div>
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ActivateModal
        id={userId}
        name={`${row.original.firstName} ${row.original.lastName}`}
        role="doctor"
        isOpen={isActivating}
        onClose={() => setIsActivating(false)}
        queryKey={`doctors_page_${currentPage}_count_${countPerPage}_sex_${currentGender}_status_${currentStatus}_sort_${sortBy}_search_${searchValue}`}
      />

      <DeactivateModal
        id={userId}
        name={`${row.original.firstName} ${row.original.lastName}`}
        isOpen={isDeactivating}
        onClose={() => setIsDeactivating(false)}
        queryKey={`doctors_page_${currentPage}_count_${countPerPage}_sex_${currentGender}_status_${currentStatus}_sort_${sortBy}_search_${searchValue}`}
      />

      <Modal
        isOpen={isChangingSpeciality}
        onClose={() => setIsChangingSpeciality(false)}
        className="h-fit"
      >
        <SpecialityForm
          doctorId={userId}
          doctorName={`${row.original.firstName} ${row.original.lastName}`}
          doctorSpeciality={row.original.speciality?.id || ''}
          onClose={() => {
            queryClient.invalidateQueries({
              queryKey: [
                `doctors_page_${currentPage}_count_${countPerPage}_sex_${currentGender}_status_${currentStatus}_sort_${sortBy}_search_${searchValue}`,
              ],
            });
            setIsChangingSpeciality(false);
          }}
        />
      </Modal>
    </>
  );
};

export const columns: ColumnDef<Doctor>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;
      const avatar = row.original.avatarURL;
      const isActive = row.original.isActive;
      const ssn = row.original.ssn;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-primary">
            {avatar ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  src={avatar}
                  alt={`${firstName} ${lastName} profile picture`}
                  referrerPolicy="no-referrer"
                  fill
                />
              </div>
            ) : (
              <AvatarFallback>
                <span>
                  {firstName[0].toUpperCase() + lastName[0].toUpperCase()}
                </span>
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <p className="flex items-center gap-1.5 font-medium text-foreground">
              <span>
                {firstName} {lastName}
              </span>
              <TooltipProvider>
                {!isActive && (
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center justify-center rounded-full p-0.5 dark:bg-white">
                        <Ban className="h-5 w-5 fill-red-500 text-gray-900" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Inactive</TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </p>
            <p className="text-sm text-muted-foreground">SSN: {ssn}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => {
      const gender: string = row.original.sex;
      return (
        <Badge
          variant={gender === 'male' ? 'default' : 'female'}
          className="capitalize"
        >
          {gender}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'speciality',
    header: 'Speciality',
    cell: ({ row }) => {
      const speciality = row.original.speciality?.name;

      return <Badge variant="outline">{speciality || 'NA'}</Badge>;
    },
  },
  {
    header: 'Contact',
    cell: ({ row }) => {
      const email = row.original.email;
      const phoneNumber = row.original.phoneNumber;

      return (
        <div className="flex flex-col whitespace-nowrap">
          <span>{email}</span>
          <span className="text-sm text-muted-foreground">{phoneNumber}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'birthDate',
    header: 'Age',
    cell: ({ row }) => {
      const birthDate: string = row.getValue('birthDate');

      return (
        <div className="flex flex-col whitespace-nowrap">
          <span>
            {differenceInYears(new Date(), parseISO(birthDate))} years old.
          </span>
          <span className="text-sm text-muted-foreground">
            {format(parseISO(birthDate), 'MMM dd, yyyy')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined at',
    cell: ({ row }) => {
      const createdAt: string = row.getValue('createdAt');

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
    id: 'actions',
    cell: ActionsCell,
  },
];
