'use client';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { SidebarProvider } from '@/components/ui/sidebar';
import ViewerSidebar from './_components/ViewerSidebar';

import useAccessToken from '@/hooks/useAccessToken';
import type { Scan } from '@/types/appointments.type';

const ViewerToolbar = dynamic(() => import('./_components/ViewerToolbar'), {
  ssr: false,
});
const Viewers = dynamic(() => import('./_components/Viewers'), { ssr: false });

interface ViewerPageProps {
  params: {
    scanId: string;
  };
}
export default function ViewerPage({ params: { scanId } }: ViewerPageProps) {
  const accessToken = useAccessToken();

  const { data: scan, isLoading } = useQuery({
    queryKey: [`scan_${scanId}`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/scans/${scanId}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as Scan;
      data.study.series.sort((a, b) => a.seriesNumber - b.seriesNumber);
      data.study.series.forEach((series) => {
        series.instances.sort((a, b) => a.instanceNumber - b.instanceNumber);
      });

      return data as Scan;
    },
    enabled: !!accessToken,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <SidebarProvider className="h-full w-full overflow-x-hidden">
      <ViewerSidebar isLoading={isLoading} series={scan?.study.series || []} />
      <div className="w-full overflow-x-hidden overflow-y-hidden">
        <ViewerToolbar />
        {!isLoading && scan && <Viewers study={scan.study} />}
      </div>
    </SidebarProvider>
  );
}
