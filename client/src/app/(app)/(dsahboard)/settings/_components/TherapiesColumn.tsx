'use client';

import type { ColumnDef, Row } from '@tanstack/react-table';
import { parseISO, format, formatDistanceToNow } from 'date-fns';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import useUserRole from '@/hooks/useUserRole';
import useSettingsStore from '@/hooks/useSettingsStore';

import type { Therapy } from '@/types/settings.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import useAccessToken from '@/hooks/useAccessToken';
import axios, { AxiosError } from 'axios';
import DeleteAlert from '@/components/DeleteAlert';

const ActionsCell = ({ row }: { row: Row<Therapy> }) => {
  const accessToken = useAccessToken();
  const { role, isSuperAdmin } = useUserRole();
  const { openForm, setCurrentTherapy } = useSettingsStore();

  if (role !== 'admin') {
    return null;
  }

  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: deleteTherapy, isPending } = useMutation({
    mutationFn: async () => {
      return await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/therapies/${row.original.id}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onError: (error) => {
      const axiosError = error as AxiosError<any, any>;

      return toast({
        title: 'Failed to delete therapy',
        description:
          axiosError?.response?.data.message ||
          'Therapy could not be deleted, please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['therapies'],
      });
      setIsDeleting(false);

      return toast({
        title: 'Therapy deleted successfully',
        description: 'Therapy has been deleted successfully.',
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
          <DropdownMenuItem
            onClick={() => {
              setCurrentTherapy(row.original);
              openForm();
            }}
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          {isSuperAdmin && (
            <DropdownMenuItem onClick={() => setIsDeleting(true)}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAlert
        title={`Delete ${row.original.name}`}
        description={`Are you sure you want to delete ${row.original.name}?`}
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onDelete={deleteTherapy}
        disabled={isPending}
      />
    </>
  );
};

export const columns: ColumnDef<Therapy>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const name = row.original.name;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={() => {
                navigator.clipboard.writeText(name);
              }}
            >
              <span className="font-medium">{name}</span>
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: 'unit',
    accessorKey: 'unit',
    header: 'Unit',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description: string | undefined = row.getValue('description');

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <p className="max-w-2xl truncate text-sm text-muted-foreground">
                {description || 'No description'}
              </p>
            </TooltipTrigger>

            {description && (
              <TooltipContent side="bottom" className="max-w-xl text-wrap">
                {description}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Created at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
