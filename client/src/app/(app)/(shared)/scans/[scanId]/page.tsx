'use client';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import useAccessToken from '@/hooks/useAccessToken';
import type { Scan } from '@/types/appointments.type';

const ViewerToolbar = dynamic(() => import('./_components/ViewerToolbar'), {
  ssr: false,
});
const Viewers = dynamic(() => import('./_components/Viewers'), { ssr: false });

interface ScanPageProps {
  params: {
    scanId: string;
  };
}
export default function ScanPage({ params: { scanId } }: ScanPageProps) {
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

      return response.data as Scan;
    },
    enabled: !!accessToken,
  });

  return (
    <div className="relative -mx-4 h-full overflow-x-hidden">
      <ViewerToolbar />
      {!isLoading && scan && <Viewers dicomURLs={scan.scanURLs} />}
    </div>
  );
}
