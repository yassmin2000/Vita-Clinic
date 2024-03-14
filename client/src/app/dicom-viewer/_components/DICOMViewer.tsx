'use client';

import { useEffect, useState } from 'react';
// @ts-ignore
import cornerstone from 'cornerstone-core';
// @ts-ignore
import cornerstoneTools from 'cornerstone-tools';

import { initCornerstone } from '@/lib/cornerstone';

export default function DICOMViewer() {
  const [isCornerstoneInitialized, setIsCornerstoneInitialized] =
    useState(false);

  const [imageIds1, setImageIds1] = useState([
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-1.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-2.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-3.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-4.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-10.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-11.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-12.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-13.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-14.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-15.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-16.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-17.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-18.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-19.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-20.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-21.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-22.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-23.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-24.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-25.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-26.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-27.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-28.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-29.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-30.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-31.dcm',
    'dicomweb://raw.githubusercontent.com/Bodykudo/DICOM-Visualizer/main/data/brain/Image-32.dcm',
  ]);

  useEffect(() => {
    if (!isCornerstoneInitialized) {
      initCornerstone();
      const element = document.getElementById('viewer');
      cornerstone.enable(element);
      setIsCornerstoneInitialized(true);
    }
  }, [isCornerstoneInitialized]);

  useEffect(() => {
    if (isCornerstoneInitialized) {
      const images: any[] = [];
      const loadImagePromises = imageIds1.map(async (imageId) => {
        const image = await cornerstone.loadImage(imageId);
        images.push(image);
        return image;
      });

      Promise.all(loadImagePromises).then((images) => {
        console.log('All images are loaded');
        const stack = {
          currentImageIdIndex: 0,
          imageIds: imageIds1,
        };
        const element = document.getElementById('viewer');
        cornerstone.displayImage(element, images[0]);
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);
      });
    }
  }, [isCornerstoneInitialized, imageIds1]);

  return <div id="viewer" className="h-full w-full" />;
}
