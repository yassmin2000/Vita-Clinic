'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SimpleBar from 'simplebar-react';
import { useResizeDetector } from 'react-resize-detector';
import { Loader2 } from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import PDFRendererControlrs from './PDFRendererControlrs';
import { useToast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFRendererProps {
  url: string;
}

export default function PDFRenderer({ url }: PDFRendererProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pagesNumber, setPagesNumber] = useState<number>();
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  return (
    <div className="flex w-full flex-col items-center rounded-md bg-background shadow dark:shadow-white/20">
      <PDFRendererControlrs
        currentPage={currentPage}
        scale={scale}
        pagesNumber={pagesNumber!}
        url={url}
        setCurrentPage={setCurrentPage}
        setScale={setScale}
        setRotation={setRotation}
      />

      <div className="max-h-screen w-full flex-1">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onError={() => {
                toast({
                  title: 'Error loading PDF',
                  description: 'Please try again later.',
                  variant: 'destructive',
                });
              }}
              onLoadSuccess={({ numPages }) => setPagesNumber(numPages)}
              file={url}
              className="h-full"
            >
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  key={'@' + renderedScale}
                />
              ) : null}

              <Page
                className={cn(isLoading ? 'hidden' : '')}
                width={width ? width : 1}
                pageNumber={currentPage}
                scale={scale}
                rotate={rotation}
                key={'@' + scale}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}
