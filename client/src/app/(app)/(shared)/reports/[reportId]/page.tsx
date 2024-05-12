import { redirect } from 'next/navigation';
import axios from 'axios';

import PDFRenderer from './_components/PDFRenderer';
import ChatWrapper from './_components/ChatWrapper';

import { getAccessToken, getUserRole } from '@/lib/auth';

import type { Report } from '@/types/appointments.type';

interface ReportPageProps {
  params: {
    reportId: string;
  };
}

export default async function ReportPage({
  params: { reportId },
}: ReportPageProps) {
  const accessToken = await getAccessToken();
  const { role } = await getUserRole();

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = response.data as Report;

    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between lg:max-h-full lg:overflow-y-hidden">
        <div className="max-w-8xl mx-auto w-full lg:flex xl:px-2">
          <div className="flex-1 xl:flex">
            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              <PDFRenderer url={data.reportURL} />
            </div>
          </div>

          {role === 'doctor' && (
            <div className="flex-[0.75] shrink-0 border-t border-gray-200 px-4 dark:border-gray-800 sm:px-6 lg:w-96 lg:border-l lg:border-t-0 lg:px-0">
              <ChatWrapper fileId={reportId} status={data.status} />
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return redirect('/dashboard');
  }
}
