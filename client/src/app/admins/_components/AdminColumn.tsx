'use client';

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
import { ColumnDef } from '@tanstack/react-table';
import {
  differenceInYears,
  parseISO,
  format,
  formatDistanceToNow,
} from 'date-fns';
import { Eye, MoreHorizontal, Pencil, Sparkles, Trash } from 'lucide-react';
import Image from 'next/image';

export type Admin = {
  id: string | number;
  name: string;
  email: string;
  birthDate: string;
  gender: 'Male' | 'Female';
  isSuperAdmin: boolean;
  joinedAt: string;
  avatar: string;
};

export const columns: ColumnDef<Admin>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.original.name;
      const avatar = row.original.avatar;
      const isSuperAdmin = row.original.isSuperAdmin;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-primary">
            {avatar ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  src={avatar}
                  alt={`${name} profile picture`}
                  referrerPolicy="no-referrer"
                  fill
                />
              </div>
            ) : (
              <AvatarFallback>
                <span>{name}</span>
              </AvatarFallback>
            )}
          </Avatar>
          <p className="flex items-center gap-1.5 font-medium text-foreground">
            <span>{name}</span>
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
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => {
      const gender: string = row.original.gender;
      return (
        <Badge variant={gender === 'Male' ? 'default' : 'female'}>
          {gender}
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
    accessorKey: 'joinedAt',
    header: 'Joined at',
    cell: ({ row }) => {
      const joinedAt: string = row.getValue('joinedAt');

      return (
        <div className="flex flex-col whitespace-nowrap">
          <span>{format(parseISO(joinedAt), 'MMM dd, yyyy')}</span>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(parseISO(joinedAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const admin = row.original;

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
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
