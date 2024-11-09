'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
// @ts-ignore
import cornerstone from 'cornerstone-core';
import { useResizeDetector } from 'react-resize-detector';

import useViewerStore from '@/hooks/useViewerStore';
import { initCornerstone } from '@/lib/cornerstone';
import { cn } from '@/lib/utils';

import type { Series, Study } from '@/types/appointments.type';

const DICOMViewer = dynamic(() => import('./DICOMViewer'), { ssr: false });

interface ViewersProps {
  study: Study;
}

export default function Viewers({ study }: ViewersProps) {
  const {
    isCornerstoneInitialized,
    setIsCornerstoneInitialized,
    layoutType,
    setLayoutType,
    selectedSeries,
    setSelectedSeries,
  } = useViewerStore();

  useEffect(() => {
    if (!isCornerstoneInitialized) {
      initCornerstone();
      setIsCornerstoneInitialized(true);
    }
  }, [isCornerstoneInitialized]);

  const countViewports = (layoutType: string) => {
    switch (layoutType) {
      case '1_big':
        return 1;
      case '2_side_by_side':
      case '2_top_to_bottom':
        return 2;
      case '3_side_by_side':
      case '3_top_to_bottom':
      case '1_big_2_small':
      case '2_small_1_big':
      case '1_big_top_2_small_bottom':
      case '2_small_top_1_big_bottom':
        return 3;
      case '4_2x2':
        return 4;
      default:
        return 1;
    }
  };

  const onResize = () => {
    const count = countViewports(layoutType);
    Array.from({ length: count }).forEach((_, index) => {
      const element = document.getElementById('viewer_' + index);
      if (element) {
        cornerstone.resize(element);
      }
    });
  };

  const { ref } = useResizeDetector({
    onResize: (_, __) => {
      onResize();
    },
  });

  useEffect(() => {
    onResize();
  }, [layoutType]);

  const setSeriesInViewpors = (series: Series[], count: number) => {
    if (count === 2 || count === 4) {
      const mgSeries = series.filter((s) => s.modality?.toLowerCase() === 'mg');
      if ((count === 2 || count === 4) && mgSeries.length === 2) {
        const right = mgSeries.find((s) => s.breastLaterality === 'r');
        const left = mgSeries.find((s) => s.breastLaterality === 'l');
        if (right && left) {
          if (count === 2) {
            setSelectedSeries([
              right.seriesInstanceUID,
              left.seriesInstanceUID,
            ]);
          } else {
            setSelectedSeries([
              right.seriesInstanceUID,
              left.seriesInstanceUID,
              ...series
                .filter((s) => s.modality?.toLocaleLowerCase() !== 'mg')
                .slice(0, 2)
                .map((s) => s.seriesInstanceUID),
            ]);
          }
          return;
        }
      }

      if (count === 4 && mgSeries.length === 4) {
        const rightCC = mgSeries.find(
          (s) => s.breastLaterality === 'r' && s.breastView === 'cc'
        );
        const rightMLO = mgSeries.find(
          (s) => s.breastLaterality === 'r' && s.breastView === 'mlo'
        );
        const leftCC = mgSeries.find(
          (s) => s.breastLaterality === 'l' && s.breastView === 'cc'
        );
        const leftMLO = mgSeries.find(
          (s) => s.breastLaterality === 'l' && s.breastView === 'mlo'
        );

        if (rightCC && rightMLO && leftCC && leftMLO) {
          setSelectedSeries([
            rightCC.seriesInstanceUID,
            leftCC.seriesInstanceUID,
            rightMLO.seriesInstanceUID,
            leftMLO.seriesInstanceUID,
          ]);
          return;
        }
      }
    }
    setSelectedSeries(series.slice(0, count).map((s) => s.seriesInstanceUID));
  };

  useEffect(() => {
    const length = study.series.length;
    switch (length) {
      case 1:
        setLayoutType('1_big');
        setSeriesInViewpors(study.series, 1);
        break;
      case 2:
        setLayoutType('2_side_by_side');
        setSeriesInViewpors(study.series, 2);
        break;
      case 3:
        setLayoutType('1_big_2_small');
        setSeriesInViewpors(study.series, 3);
        break;
      case 4:
        setLayoutType('4_2x2');
        setSeriesInViewpors(study.series, 4);
        break;
      default:
        setLayoutType('1_big');
        setSeriesInViewpors(study.series, 1);
        break;
    }
  }, [study]);

  const renderViewers = (count: number, start: number = 0) =>
    Array.from({ length: count }).map((_, i) => {
      const series = study.series.find(
        (s) => s.seriesInstanceUID === selectedSeries[i + start]
      );

      return (
        <DICOMViewer
          key={`viewer_${i + start}_${series?.seriesInstanceUID}`}
          index={i + start}
          studyId={study.studyInstanceUID}
          series={series}
        />
      );
    });

  const renderViewports = (layoutType: string) => {
    switch (layoutType) {
      case '1_big':
        return renderViewers(1);
      case '2_side_by_side':
        return renderViewers(2);
      case '2_top_to_bottom':
        return renderViewers(2);
      case '3_side_by_side':
        return renderViewers(3);
      case '3_top_to_bottom':
        return renderViewers(3);
      case '4_2x2':
        return renderViewers(4);
      case '1_big_2_small':
        return (
          <>
            {renderViewers(1)}
            <div className="grid grid-rows-2">{renderViewers(2, 1)}</div>
          </>
        );
      case '2_small_1_big':
        return (
          <>
            <div className="grid grid-rows-2">{renderViewers(2)}</div>
            {renderViewers(1, 2)}
          </>
        );
      case '1_big_top_2_small_bottom':
        return (
          <>
            {renderViewers(1)}
            <div className="grid grid-cols-2">{renderViewers(2, 1)}</div>
          </>
        );
      case '2_small_top_1_big_bottom':
        return (
          <>
            <div className="grid grid-cols-2">{renderViewers(2)}</div>
            {renderViewers(1, 2)}
          </>
        );
      default:
        return renderViewers(1);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'grid h-[calc(100vh-52px)]',
        layoutType === '1_big' && 'grid-cols-1',
        (layoutType === '2_side_by_side' ||
          layoutType === '1_big_2_small' ||
          layoutType === '2_small_1_big') &&
          'grid-cols-2',
        (layoutType === '2_top_to_bottom' ||
          layoutType === '1_big_top_2_small_bottom' ||
          layoutType === '2_small_top_1_big_bottom') &&
          'grid-rows-2',
        layoutType === '3_side_by_side' && 'grid-cols-3',
        layoutType === '3_top_to_bottom' && 'grid-rows-3',
        layoutType === '4_2x2' && 'grid-cols-2 grid-rows-2'
      )}
    >
      {renderViewports(layoutType)}
    </div>
  );
}
