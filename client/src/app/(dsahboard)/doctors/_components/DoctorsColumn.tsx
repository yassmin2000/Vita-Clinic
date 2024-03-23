'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';
import {
  differenceInYears,
  parseISO,
  format,
  formatDistanceToNow,
} from 'date-fns';
import { Eye, MoreHorizontal, Pencil, Trash } from 'lucide-react';

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

export type Doctor = {
  id: string | number;
  name: string;
  email: string;
  birthDate: string;
  gender: 'Male' | 'Female';
  specialty: string;
  joinedAt: string;
  avatar: string;
};

export const columns: ColumnDef<Doctor>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.original.name;
      const avatar = row.original.avatar;

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
                <span>
                  {name.split(' ')[0][0].toUpperCase() +
                    name.split(' ')[1][0].toUpperCase()}
                </span>
              </AvatarFallback>
            )}
          </Avatar>
          <p className="font-medium text-foreground">{name}</p>
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
    accessorKey: 'specialty',
    header: 'Speciality',
    cell: ({ row }) => {
      const speciality = row.original.specialty;
      return <Badge variant="outline">{speciality}</Badge>;
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
      const doctor = row.original;

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
            <Link href={`/users/${doctor.id}`}>
              <DropdownMenuItem asChild>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View profile
                </div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
