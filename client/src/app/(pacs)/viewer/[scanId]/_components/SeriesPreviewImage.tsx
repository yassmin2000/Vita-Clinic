'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

import useViewerStore from '@/hooks/useViewerStore';
import useAccessToken from '@/hooks/useAccessToken';
import useUserCachingSettings from '@/hooks/useUserCachingSettings';
import CacheManager from '@/lib/CacheManager';
import { handleResetViewport } from './ViewerToolbar';

import type { CachingSettings } from '@/types/users.type';

interface SeriesPreviewImageProps {
  seriesId: string;
  url: string;
}

export default function SeriesPreviewImage({
  seriesId,
  url,
}: SeriesPreviewImageProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { currentViewerId, setSelectedSeriesByIndex } = useViewerStore();
  const accessToken = useAccessToken();
  const cachingSettings = useUserCachingSettings();

  const fetchImage = async (
    url: string,
    accessToken: string,
    settings: CachingSettings
  ) => {
    try {
      setLoading(true);
      const file = await CacheManager.fetchAndStorePreviewSeriesImage(
        seriesId,
        url,
        accessToken,
        settings.enableDicomCaching
      );
      setImageFile(file);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching image:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && cachingSettings && !imageFile && !loading) {
      fetchImage(url, accessToken || '', cachingSettings);
    }
  }, [url, accessToken, cachingSettings, imageFile, loading]);

  if (!imageFile || loading) {
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
