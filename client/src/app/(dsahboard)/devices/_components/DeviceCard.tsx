'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Eye, MoreVertical, Pencil, Trash } from 'lucide-react';

import { Card, CardHeader } from '@/components/ui/card';
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

interface DeviceCardProps {
  id: string;
  deviceImage: string;
  deviceName: string;
  manufacturer: string;
  lastMaintenanceDate: string;
  purchaseDate: string;
  status: 'active' | 'inactive';
  serialNumber: string;
}

export default function DeviceCard({
  id,
  deviceImage,
  deviceName,
  manufacturer,
  lastMaintenanceDate,
  purchaseDate,
  status,
  serialNumber,
}: DeviceCardProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="p-0">
        <div
          className="h-40 w-full rounded-t-lg bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${deviceImage})`,
          }}
        />
        <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">{deviceName}</h3>
              <p className="text-base text-muted-foreground">{manufacturer}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => router.push(`/devices/${id}/edit`)}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href={`/users/${id}`}>
                  <DropdownMenuItem asChild>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </div>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={status === 'active' ? 'active' : 'inactive'}
              className="w-fit capitalize"
            >
              {status}
            </Badge>
            <p className="text-sm font-medium">
              Serial No:{' '}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => {
                      navigator.clipboard.writeText(serialNumber);
                    }}
                  >
                    <span className="text-primary">{serialNumber}</span>
                  </TooltipTrigger>
                  <TooltipContent>Copy to clipboard</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
          </div>
          <div className="mt-0.5">
            <p className="text-sm text-muted-foreground">
              Last maintained{' '}
              {formatDistanceToNow(parseISO(lastMaintenanceDate))} ago (
              {format(parseISO(lastMaintenanceDate), 'MMM dd, yyyy')})
            </p>
            <p className="text-sm text-muted-foreground">
              Purchased on {format(parseISO(purchaseDate), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
