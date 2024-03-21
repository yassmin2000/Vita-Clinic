import PDFRenderer from './_components/PDFRenderer';
import ChatWrapper from './_components/ChatWrapper';

interface ReportPageProps {
  params: {
    reportId: string;
  };
}

export default function ReportPage({ params: { reportId } }: ReportPageProps) {
  const url =
    'https://utfs.io/f/80610c4c-72f4-4f96-8564-c24dc1f0e7d1-wgdh3q.pdf';
  const fileId = 'XXYYZZEEWW';

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between lg:max-h-full lg:overflow-y-hidden">
      <div className="max-w-8xl mx-auto w-full lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PDFRenderer url={url} />
          </div>
        </div>

        <div className="flex-[0.75] shrink-0 border-t border-gray-200 px-4 dark:border-gray-800 sm:px-6 lg:w-96 lg:border-l lg:border-t-0 lg:px-0">
          <ChatWrapper fileId={fileId} />
        </div>
      </div>
    </div>
  );
}
