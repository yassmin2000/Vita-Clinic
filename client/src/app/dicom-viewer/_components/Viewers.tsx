'use client';

import useViewerStore from '@/hooks/useViewerStore';
import DICOMViewer from './DICOMViewer';

export default function Viewers() {
  const { rows, cols } = useViewerStore();

  return (
    <div className={`grid h-full grid-cols-${cols} grid-rows-${rows}`}>
      {Array.from({ length: rows * cols }).map((_, index) => (
        <DICOMViewer key={`${rows}_${cols}_${index}`} index={index} />
      ))}
    </div>
  );
}
