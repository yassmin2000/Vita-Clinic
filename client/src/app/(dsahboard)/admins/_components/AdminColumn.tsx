'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ColumnDef, Row } from '@tanstack/react-table';
import {
  differenceInYears,
  parseISO,
  format,
  formatDistanceToNow,
} from 'date-fns';
import { Eye, MoreHorizontal, ShieldMinus, Sparkles } from 'lucide-react';

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { Admin } from '@/types/users.type';
import useUserRole from '@/hooks/useUserRole';

const ActionsCell = ({ row }: { row: Row<Admin> }) => {
  const { isSuperAdmin } = useUserRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Link href={`/users/${row.original.id}`}>
          <DropdownMenuItem asChild>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> View Profile
            </div>
          </DropdownMenuItem>
        </Link>
        {isSuperAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <ShieldMinus className="h-4 w-4" /> Deactivate
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Admin>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;
      const avatar = row.original.avatarURL;
      const isSuperAdmin = row.original.isSuperAdmin;

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
          <p className="flex items-center gap-1.5 font-medium text-foreground">
            <span>
              {firstName} {lastName}
            </span>
            {isSuperAdmin && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center justify-center rounded-full p-0.5 dark:bg-white">
                      <Sparkles className="h-5 w-5 fill-yellow-500 text-gray-900" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>System Admin</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'sex',
    header: 'Gender',
    cell: ({ row }) => {
      const sex: string = row.original.sex;
      return (
        <Badge
          variant={sex === 'male' ? 'default' : 'female'}
          className="capitalize"
        >
          {sex}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
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
