'use client';

import { useEffect, useState } from 'react';
// @ts-ignore
import cornerstone from 'cornerstone-core';
// @ts-ignore
import cornerstoneTools from 'cornerstone-tools';
// @ts-ignore
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

import useViewerStore from '@/hooks/useViewerStore';
import { handleSetViewToLeft, handleSetViewToRight } from './ViewerToolbar';
import { cn } from '@/lib/utils';
import type { Series } from '@/types/appointments.type';

interface DICOMViewerProps {
  index: number;
  studyId: string;
  series?: Series;
}

export default function DICOMViewer({
  index,
  studyId,
  series,
}: DICOMViewerProps) {
  const { isCornerstoneInitialized, currentViewerId, setCurrentViewerId } =
    useViewerStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const element = document.getElementById('viewer_' + index);
    if (element && !isLoaded) {
      cornerstone.enable(element);
    }
  }, [index, isLoaded]);

  const loadImages = async () => {
    if (!series) return;

    setIsLoading(true);
    const element = document.getElementById('viewer_' + index);

    if (!element || isLoaded) return;

    const stack: {
      currentImageIdIndex: number;
      imageIds: any[];
    } = {
      currentImageIdIndex: 0,
      imageIds: [],
    };

    cornerstoneTools.addStackStateManager(element, ['stack']);
    cornerstoneTools.addToolState(element, 'stack', stack);
    cornerstoneTools.setToolActive('StackScrollMouseWheel', {});

    for (let i = 0; i < series.instances.length; i++) {
      try {
        const instance = series.instances[i];
        const response = await fetch(instance.url);
        const blob = await response.blob();
        const file = new File([blob], instance.sopInstanceUID, {
          type: blob.type,
        });

        const image = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);

        if (image) {
          const loadedImage = await cornerstone.loadImage(image);
          stack.imageIds.push(image);

          if (i === 0) {
            cornerstone.displayImage(element, loadedImage);
          } else {
            cornerstone.updateImage(element);
          }
        }
      } catch (error) {
        console.error(`Failed to load image ${i + 1}:`, error);
      }
    }

    if (series && series.modality === 'MG') {
      if (series.breastLaterality === 'r') {
        handleSetViewToRight(`viewer_${index}`);
      }

      if (series.breastLaterality === 'l') {
        handleSetViewToLeft(`viewer_${index}`);
      }
    }

    setIsLoaded(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isCornerstoneInitialized && !isLoaded && !isLoading) {
      loadImages();
    }
  }, [isCornerstoneInitialized, series, isLoaded, isLoading, index]);

  return (
    <div
      onClick={() => {
        if (currentViewerId !== index) setCurrentViewerId(index);
      }}
      id={`viewer_${index}`}
      className={cn(
        'relative w-full border',
        currentViewerId === index && 'border-primary'
      )}
    />
  );
}
