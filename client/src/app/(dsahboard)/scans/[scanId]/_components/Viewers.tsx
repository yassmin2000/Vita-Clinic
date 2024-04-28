'use client';

import dynamic from 'next/dynamic';

const DICOMViewer = dynamic(() => import('./DICOMViewer'), {
  ssr: false,
});
import useViewerStore from '@/hooks/useViewerStore';
import { cn } from '@/lib/utils';

interface ViewersProps {
  dicomURLs: string[];
}

export default function Viewers({ dicomURLs }: ViewersProps) {
  const { firstViewportsCount, secondViewportsCount, splitViewportsBy } =
    useViewerStore();

  return (
    <div
      className={cn(
        'grid h-full',
        splitViewportsBy === 'cols'
          ? secondViewportsCount === 0
            ? 'grid-cols-1'
            : 'grid-cols-2'
          : secondViewportsCount === 0
            ? 'grid-rows-1'
            : 'grid-rows-2'
      )}
    >
      <div
        className={cn(
          'grid h-full',
          splitViewportsBy === 'cols'
            ? firstViewportsCount === 1
              ? 'grid-rows-1'
              : 'grid-rows-2'
            : firstViewportsCount === 1
              ? 'grid-cols-1'
              : 'grid-cols-2'
        )}
      >
        {Array.from({ length: firstViewportsCount }).map((_, i) => (
          <DICOMViewer
            key={`${firstViewportsCount}_${secondViewportsCount}_${splitViewportsBy}_${i}`}
            index={i}
            dicomURLs={dicomURLs}
          />
        ))}
      </div>
      {secondViewportsCount === 0 ? null : (
        <div
          className={cn(
            'grid h-full',
            splitViewportsBy === 'cols'
              ? secondViewportsCount === 1
                ? 'grid-rows-1'
                : 'grid-rows-2'
              : secondViewportsCount === 1
                ? 'grid-cols-1'
                : 'grid-cols-2'
          )}
        >
          {Array.from({ length: secondViewportsCount }).map((_, i) => (
            <DICOMViewer
              key={`${firstViewportsCount}_${secondViewportsCount}_${splitViewportsBy}_${i * 10}`}
              index={(i + 1) * 10}
              dicomURLs={dicomURLs}
            />
          ))}
        </div>
      )}
    </div>
  );
}
