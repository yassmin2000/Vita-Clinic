import DICOMViewer from './_components/DICOMViewer';
import ViewerToolbar from './_components/ViewerToolbar';

export default function DICOMViewerPage() {
  return (
    <div
      className="relative -mx-4 h-full overflow-hidden"
      // onContextMenu={(e) => e.preventDefault()}
    >
      <ViewerToolbar />
      <DICOMViewer />
    </div>
  );
}
