'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

import useViewerStore from '@/hooks/useViewerStore';
import { handleResetViewport } from './ViewerToolbar';
import CacheManager from '@/lib/CacheManager';

interface SeriesPreviewImageProps {
  seriesId: string;
  url: string;
}

export default function SeriesPreviewImage({
  seriesId,
  url,
}: SeriesPreviewImageProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentViewerId, setSelectedSeriesByIndex } = useViewerStore();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const file = await CacheManager.fetchAndStorePreviewSeriesImage(
          seriesId,
          url
        );
        setImageFile(file);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching image:', error);
        setLoading(false);
      }
    };

    fetchImage();
  }, [url]);

  if (loading) {
    return <Skeleton className="h-32 w-40 rounded-md" />;
  }
  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : '';

  return (
    <div
      className="h-32 w-40 cursor-pointer rounded-md border-2 bg-cover bg-center"
      onClick={() => {
        setSelectedSeriesByIndex(currentViewerId, seriesId);
        handleResetViewport(`viewer_${currentViewerId}`);
      }}
      style={{ backgroundImage: `url(${imageUrl})` }}
    ></div>
  );
}
