'use client';
import dynamic from 'next/dynamic';

const ViewerToolbar = dynamic(() => import('./_components/ViewerToolbar'), {
  ssr: false,
});
const Viewers = dynamic(() => import('./_components/Viewers'), { ssr: false });

export default function DICOMViewerPage() {
  return (
    <div className="relative -mx-4 h-full overflow-x-hidden">
      <ViewerToolbar />
      <Viewers />
    </div>
  );
}
