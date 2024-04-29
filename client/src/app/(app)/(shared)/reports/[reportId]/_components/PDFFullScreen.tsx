import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import SimpleBar from 'simplebar-react';
import { useResizeDetector } from 'react-resize-detector';
import { Fullscreen, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface PDFFullScreenProps {
  url: string;
}

export default function PDFFullScreen({ url }: PDFFullScreenProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pagesNumber, setPagesNumber] = useState<number>();

  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button aria-label="fullscreen" variant="ghost">
          <Fullscreen className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-7xl">
        <SimpleBar autoHide={false} className="mt-6 max-h-[calc(100vh-10rem)]">
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
              {new Array(pagesNumber).fill(0).map((_, i) => (
                <Page key={i} pageNumber={i + 1} width={width ? width : 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
}
