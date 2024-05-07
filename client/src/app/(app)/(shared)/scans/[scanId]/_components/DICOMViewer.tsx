'use client';

import { useEffect, useState } from 'react';
// @ts-ignore
import cornerstone from 'cornerstone-core';
// @ts-ignore
import cornerstoneTools from 'cornerstone-tools';

import { initCornerstone } from '@/lib/cornerstone';
import useViewerStore from '@/hooks/useViewerStore';
import { cn } from '@/lib/utils';

interface DICOMViewerProps {
  index: number;
  dicomURLs: string[];
}

export default function DICOMViewer({ index, dicomURLs }: DICOMViewerProps) {
  const { currentViewerId, setCurrentViewerId } = useViewerStore();

  const [isCornerstoneInitialized, setIsCornerstoneInitialized] =
    useState(false);

  useEffect(() => {
    if (!isCornerstoneInitialized) {
      initCornerstone();
      const element = document.getElementById('viewer_' + index);
      cornerstone.enable(element);
      setIsCornerstoneInitialized(true);
    }
  }, [isCornerstoneInitialized]);

  useEffect(() => {
    if (isCornerstoneInitialized) {
      const images: any[] = [];
      const loadImagePromises = dicomURLs.map(async (imageId) => {
        const image = await cornerstone.loadImage(imageId);
        images.push(image);
        return image;
      });

      Promise.all(loadImagePromises).then((images) => {
        const stack = {
          currentImageIdIndex: 0,
          imageIds: dicomURLs,
        };
        const element = document.getElementById('viewer_' + index);
        cornerstone.displayImage(element, images[0]);
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);
      });
    }
  }, [isCornerstoneInitialized, dicomURLs]);

  return (
    <div
      onClick={() => {
        setCurrentViewerId(index);
      }}
      id={`viewer_${index}`}
      className={cn(
        'h-full w-full border',
        currentViewerId === index && 'border-primary'
      )}
    />
  );
}
