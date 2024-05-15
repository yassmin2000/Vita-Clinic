import AdminStatistics from './_components/AdminStatistics';
import DoctorStatistics from './_components/DoctorStatistics';
import InvoicesChart from './_components/InvoicesChart';
import PatientsAgeSexDistributionChart from './_components/PatientsAgeSexDistributionChart';
import AppointmentsCalendarChart from './_components/AppointmentsCalendarChart';
import DoctorsSexChart from './_components/DoctorsSexChart';
import DoctorsCompletedAppointmentsChart from './_components/DoctorsCompletedAppointmentsChart';
import MedicalServicesInsights from './_components/MedicalServicesInsights';
import MedicalInsights from './_components/MedicalInsights';

import { getUserRole } from '@/lib/auth';

export default async function Home() {
  const { role } = await getUserRole();

  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        {role === 'admin' ? <AdminStatistics /> : <DoctorStatistics />}

        {role === 'admin' && <InvoicesChart />}

        <PatientsAgeSexDistributionChart />

        {role === 'admin' && (
          <>
            <AppointmentsCalendarChart />

            <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-2">
              <DoctorsSexChart />
              <DoctorsCompletedAppointmentsChart />
            </div>
          </>
        )}

        {role === 'admin' ? <MedicalServicesInsights /> : <MedicalInsights />}
      </div>
    </section>
  );
}
