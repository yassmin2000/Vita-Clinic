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

import type { Lookup } from '@/types/settings.type';

const ActionsCell = ({ row }: { row: Row<Lookup> }) => {
  const { isSuperAdmin } = useUserRole();
  const { openForm, setCurrentLookup } = useSettingsStore();

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
        <DropdownMenuItem
          onClick={() => {
            setCurrentLookup(row.original);
            openForm();
          }}
        >
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        {isSuperAdmin && (
          <DropdownMenuItem>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Lookup>[] = [
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
