'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import SeriesPreviewImage from './SeriesPreviewImage';
import { Skeleton } from '@/components/ui/skeleton';

import type { Series } from '@/types/appointments.type';

interface ViewerSidebarProps {
  series: Series[];
  isLoading: boolean;
}

export default function ViewerSidebar({
  series,
  isLoading,
}: ViewerSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>{/* LOGO HERE */}</SidebarHeader>
      <SidebarContent className="mt-12">
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <Skeleton className="h-32 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        {series.map((series) => (
          <div
            key={series.seriesInstanceUID}
            className="flex flex-col items-center gap-2"
          >
            <SeriesPreviewImage
              seriesId={series.seriesInstanceUID}
              url={`${process.env.NEXT_PUBLIC_API_URL}/pacs/preview?fileURL=${decodeURIComponent(series.instances[0].url).replace(/&/g, '%26')}&extension=png`}
            />
            <p className="text-center text-sm font-medium">
              {series.description}
            </p>
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
