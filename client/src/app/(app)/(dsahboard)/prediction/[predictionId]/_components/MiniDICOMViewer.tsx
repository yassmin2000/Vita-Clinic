'use client';

import { useEffect, useState } from 'react';
// @ts-ignore
import cornerstone from 'cornerstone-core';
// @ts-ignore
import cornerstoneTools from 'cornerstone-tools';
// @ts-ignore
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { initCornerstone } from '@/lib/cornerstone';

import type { Instance } from '@/types/appointments.type';
import useViewerStore from '@/hooks/useViewerStore';
import { useResizeDetector } from 'react-resize-detector';

interface MiniDICOMViewerProps {
  instance: Instance;
}

export default function MiniDICOMViewer({ instance }: MiniDICOMViewerProps) {
  const { isCornerstoneInitialized, setIsCornerstoneInitialized } =
    useViewerStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onResize = () => {
    const element = document.getElementById('mini_viewer');
    if (element) {
      cornerstone.resize(element);
    }
  };

  const { ref } = useResizeDetector({
    onResize: (_, __) => {
      setTimeout(onResize, 60);
    },
  });

  useEffect(() => {
    if (!isCornerstoneInitialized) {
      initCornerstone();
      setIsCornerstoneInitialized(true);
    }
  }, [isCornerstoneInitialized]);

  useEffect(() => {
    const element = document.getElementById('mini_viewer');
    if (element && !isLoaded) {
      cornerstone.enable(element);
    }
  }, [isLoaded]);

  const loadImages = async (instance: Instance) => {
    setIsLoading(true);
    const element = document.getElementById('mini_viewer');

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

    const response = await fetch(instance.url);
    const blob = await response.blob();
    const file = new File([blob], instance.id, { type: blob.type });
    const image = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    if (image) {
      const loadedImage = await cornerstone.loadImage(image);
      stack.imageIds.push(image);
      cornerstone.displayImage(element, loadedImage);
    }

    setIsLoaded(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isCornerstoneInitialized && instance && !isLoaded && !isLoading) {
      loadImages(instance);
    }
  }, [isCornerstoneInitialized, instance, isLoaded, isLoading]);

  return (
    <div
      id="mini_viewer"
      ref={ref}
      className="relative h-full w-full flex-1 border border-primary"
    />
  );
}
