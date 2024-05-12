import InvoicesChart from './_components/InvoicesChart';
import PatientsAgeSexDistributionChart from './_components/PatientsAgeSexDistributionChart';
import AppointmentsCalendarChart from './_components/AppointmentsCalendarChart';
import DoctorsSexChart from './_components/DoctorsSexChart';

import { getUserRole } from '@/lib/auth';

export default async function Home() {
  const { role } = await getUserRole();

  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        {role === 'admin' && (
          <div>
            <InvoicesChart />
          </div>
        )}

        <div>
          <PatientsAgeSexDistributionChart />
        </div>

        {role === 'admin' && (
          <>
            <div>
              <AppointmentsCalendarChart />
            </div>

            <div className="flex w-full flex-col items-start justify-start gap-8 md:flex-row">
              <div className="w-[47%]">
                <DoctorsSexChart />
              </div>
              <div className="w-[47%]"></div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
