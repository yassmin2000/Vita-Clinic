'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { AlertCircle, Info, Pencil, Plus, Trash } from 'lucide-react';

import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Modal from '../Modal';
import ScanForm from '@/app/(app)/(shared)/appointments/[appointmentId]/_components/ScanForm';
import { Separator } from '../ui/separator';

import useUserRole from '@/hooks/useUserRole';
import type { Scan } from '@/types/appointments.type';
import CacheManager from '@/lib/CacheManager';
import { useToast } from '../ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface ScanItemProps {
  scan: Scan;
}

export default function ScanItem({ scan }: ScanItemProps) {
  const { role } = useUserRole();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cache, setCache] = useState<{
    studyId: string;
    cachedInstances: number;
    instancesCount: number;
    originalSize: number;
    compressedSize: number;
  } | null>(null);

  const { toast } = useToast();

  const handleClearStudyCache = async () => {
    setIsClearingCache(true);
    try {
      await CacheManager.clearStudyCache(scan.study.studyInstanceUID);
      setCache(null);
      toast({
        title: 'Cache Cleared',
        description: 'The cache for this study has been cleared.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while clearing the cache.',
        variant: 'destructive',
      });
    } finally {
      setIsClearingCache(false);
    }
  };

  useEffect(() => {
    const fetchCache = async () => {
      const cachedStudyInfo = await CacheManager.getCachedStudyInfo(
        scan.study.studyInstanceUID
      );
      setCache(cachedStudyInfo);
    };

    fetchCache();
  }, [scan]);

  return (
    <Card className="col-span-1 divide-y divide-accent rounded-lg transition-all hover:shadow-lg dark:shadow-white/10">
      <Link href={`/viewer/${scan.id}`} className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="flex-1 truncate">
            <div className="flex flex-col gap-0.5">
              <h3 className="truncate text-lg font-medium text-zinc-900 dark:text-gray-100">
                {scan.title}
              </h3>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between gap-1 px-6 py-2 text-xs text-muted-foreground">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {format(new Date(scan.createdAt), 'dd MMM yyyy')}
          </div>

          <div className="flex items-center gap-0.5">
            <span className="font-medium">Modality:</span>
            <span>{scan.modality.name}</span>
          </div>
        </div>

        <div className="flex gap-1">
          {role && role === 'doctor' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only ">Edit Scan</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Scan</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button size="sm" onClick={() => setIsDetailsOpen(true)}>
                  <Info className="h-4 w-4" />
                  <span className="sr-only ">View Scan Details</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Scan Details</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-6 px-6 py-2 text-xs text-muted-foreground">
        {cache ? (
          <div className="flex flex-col gap-0">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">Cached Instances:</span>
                <span>
                  {cache.cachedInstances}/{cache.instancesCount}
                </span>
              </div>
              <Button
                size="sm"
                variant="link"
                onClick={handleClearStudyCache}
                disabled={isClearingCache}
                className="text-destructive"
              >
                <Trash className="mr-1 h-3.5 w-3.5" /> Clear
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Size:</span>
              <span>{Math.round(cache.compressedSize / 1024 / 1024)}MB</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="flex items-center font-medium">
              <AlertCircle className="mr-1 h-3.5 w-3.5" /> Scan is not cached
            </span>
          </div>
        )}
      </div>

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        className="h-fit md:overflow-y-auto"
      >
        <div className="space-y-6 px-4 py-2 text-foreground">
          <div className="w-full space-y-2">
            <div>
              <h3 className="text-lg font-medium">Scan Details</h3>
              <p className="text-sm text-muted-foreground">
                Details of the scan.
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">Scan Title</p>
              <p>{scan.title}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">Modality</p>
              <p>{scan.modality.name}</p>
            </div>

            {scan.modality.description && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Modality Description</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: scan.modality.description.replace(/\n/g, '<br />'),
                  }}
                />
              </div>
            )}

            {scan.notes && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Additional Notes</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: scan.notes.replace(/\n/g, '<br />'),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        className="h-fit px-6 py-8"
      >
        <ScanForm
          appointmentId={scan.appointmentId}
          onClose={() => setIsEditing(false)}
          scanId={scan.id}
          defaultValues={{
            title: scan.title,
            modality: scan.modality.id,
            notes: scan.notes,
          }}
        />
      </Modal>
    </Card>
  );
}
