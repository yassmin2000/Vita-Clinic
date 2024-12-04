'use client';

import useAccessToken from '@/hooks/useAccessToken';
import { Prediction } from '@/types/cdss.type';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import dynamic from 'next/dynamic';

const PredictionModal = dynamic(() => import('./_components/PredictionModal'), {
  ssr: false,
});

interface PredictionPageProps {
  params: {
    predictionId: string;
  };
}

export default function PredictionPage({
  params: { predictionId },
}: PredictionPageProps) {
  const accessToken = useAccessToken();

  const { data: prediction, isLoading } = useQuery({
    queryKey: [`prediction_${predictionId}`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/cdss/${predictionId}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Prediction;
    },
    enabled: !!accessToken,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return <PredictionModal prediction={prediction} isLoading={isLoading} />;
}
