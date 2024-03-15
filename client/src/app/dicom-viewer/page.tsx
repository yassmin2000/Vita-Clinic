import ViewerToolbar from './_components/ViewerToolbar';
import Viewers from './_components/Viewers';

export default function DICOMViewerPage() {
  return (
    <div className="relative -mx-4 h-full overflow-x-hidden">
      <ViewerToolbar />
      <Viewers />
    </div>
  );
}
