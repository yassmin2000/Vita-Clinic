'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  differenceInYears,
  parseISO,
  format,
  formatDistanceToNow,
} from 'date-fns';
import {
  Ban,
  Eye,
  File,
  FileScan,
  FileStack,
  MoreHorizontal,
  Pencil,
  Pill,
  ShieldMinus,
  ShieldPlus,
  TestTubes,
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
import Modal from '@/components/Modal';
import InsuranceForm from './InsuranceForm';
import DeleteAlert from '@/components/DeleteAlert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icons } from '@/components/Icons';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';
import { useTableOptions } from '@/hooks/useTableOptions';

import { bloodTypes } from '@/lib/constants';
import type { Patient } from '@/types/users.type';

const ActionsCell = ({ row }: { row: Row<Patient> }) => {
  const accessToken = useAccessToken();
  const { role, isSuperAdmin } = useUserRole();

  const userId = row.original.id;
  const isActive = row.original.isActive;
  const insurance = row.original.emr?.insurance;
  const [isActivating, setIsActivating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isEditingInsurance, setIsEditingInsurance] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    sortBy,
    searchValue,
    currentGender,
    currentStatus,
    currentPage,
    countPerPage,
  } = useTableOptions();

  const { mutate: activateUser, isPending: isActivatingPending } = useMutation({
    mutationFn: async () => {
      return await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/activate`,
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onError: () => {
      return toast({
        title: `Failed to activate user`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          `patients_page_${currentPage}_count_${countPerPage}_sex_${currentGender}_status_${currentStatus}_sort_${sortBy}_search_${searchValue}`,
        ],
      });
      setIsActivating(false);

      return toast({
        title: `User activated successfully`,
        description: 'User can now log in and access the system.',
      });
    },
  });

  const { mutate: deactivateUser, isPending: isDeactivatingPending } =
    useMutation({
      mutationFn: async () => {
        return await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/deactivate`,
          {},
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
      },
      onError: () => {
        return toast({
          title: `Failed to deactivate user`,
          description: 'Please try again later.',
          variant: 'destructive',
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            `patients_page_${currentPage}_count_${countPerPage}_sex_${currentGender}_status_${currentStatus}_sort_${sortBy}_search_${searchValue}`,
          ],
        });
        setIsDeactivating(false);

        return toast({
          title: `User deactivated successfully`,
          description: 'User can no longer log in and access the system.',
        });
      },
    });

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
          <Link href={`/profile/${userId}`}>
            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" /> View Profile
              </div>
            </DropdownMenuItem>
          </Link>
          {role === 'admin' && (
            <DropdownMenuItem onClick={() => setIsEditingInsurance(true)}>
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4" /> Edit Insurance
              </div>
            </DropdownMenuItem>
          )}
          <Link href={`/patients/${userId}/emr`}>
            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <FileStack className="h-4 w-4" /> View EMR
              </div>
            </DropdownMenuItem>
          </Link>
          {role === 'doctor' && (
            <Link href={`/patients/${userId}/emr/edit`}>
              <DropdownMenuItem asChild>
                <div className="flex items-center gap-2">
                  <Pencil className="h-4 w-4" /> Edit EMR
                </div>
              </DropdownMenuItem>
            </Link>
          )}
          <Link href={`/patients/${userId}/reports`}>
            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <File className="h-4 w-4" /> View Patient Reports
              </div>
            </DropdownMenuItem>
          </Link>
          <Link href={`/patients/${userId}/scans`}>
            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <FileScan className="h-4 w-4" /> View Patient Scans
              </div>
            </DropdownMenuItem>
          </Link>
          <Link href={`/patients/${userId}/test-results`}>
            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <TestTubes className="h-4 w-4" /> View Patient Test Results
              </div>
            </DropdownMenuItem>
          </Link>
          <Link href={`/patients/${userId}/prescriptions`}>
            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4" /> View Patient Prescriptions
              </div>
            </DropdownMenuItem>
          </Link>
          <Link href={`/patients/${userId}/treatments`}>
            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <Icons.treatment className="h-4 w-4" /> View Patient Treatments
              </div>
            </DropdownMenuItem>
          </Link>
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

      <DeleteAlert
        title={`Activate ${row.original.firstName} ${row.original.lastName} account`}
        description={`Are you sure you want to activate ${row.original.firstName} ${row.original.lastName} account? This means they will be able to log in and access the system.`}
        deleteText="Activate"
        isOpen={isActivating}
        onClose={() => setIsActivating(false)}
        onDelete={activateUser}
        disabled={isActivatingPending}
      />

      <DeleteAlert
        title={`Deactivate ${row.original.firstName} ${row.original.lastName} account`}
        description={`Are you sure you want to deactivate ${row.original.firstName} ${row.original.lastName} account? This means they will not be able to log in and access the system.`}
        deleteText="Deactivate"
        isOpen={isDeactivating}
        onClose={() => setIsDeactivating(false)}
        onDelete={deactivateUser}
        disabled={isDeactivatingPending}
      />

      <Modal
        isOpen={isEditingInsurance}
        onClose={() => setIsEditingInsurance(false)}
        className="h-fit"
      >
        <InsuranceForm
          patientId={userId}
          isInsuranceExisting={Boolean(insurance)}
          patientName={`${row.original.firstName} ${row.original.lastName}`}
          defaultValues={
            insurance
              ? {
                  insurancePolicyNumber: insurance.policyNumber,
                  insuranceProvider: insurance.provider,
                  insurancePolicyStartDate: new Date(insurance.policyStartDate),
                  insurancePolicyEndDate: new Date(insurance.policyEndDate),
                }
              : undefined
          }
          onClose={() => {
            queryClient.invalidateQueries({
              queryKey: [
                `patients_page_${currentPage}_count_${countPerPage}_sex_${currentGender}_status_${currentStatus}_sort_${sortBy}_search_${searchValue}`,
              ],
            });
            setIsEditingInsurance(false);
          }}
        />
      </Modal>
    </>
  );
};

export const columns: ColumnDef<Patient>[] = [
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
    accessorKey: 'bloodType',
    header: 'Blood type',
    cell: ({ row }) => {
      const bloodType = row.original.emr?.bloodType;

      if (!bloodType) {
        return <Badge variant="outline">NA</Badge>;
      }

      return (
        <Badge variant="outline">
          {bloodTypes.find((type) => type.value === bloodType)?.label || 'NA'}
        </Badge>
      );
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
