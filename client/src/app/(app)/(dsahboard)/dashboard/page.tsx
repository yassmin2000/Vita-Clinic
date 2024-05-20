import AdminStatistics from './_components/AdminStatistics';
import DoctorStatistics from './_components/DoctorStatistics';
import InvoicesChart from './_components/InvoicesChart';
import PatientsAgeSexDistributionChart from './_components/PatientsAgeSexDistributionChart';
import AppointmentsCalendarChart from './_components/AppointmentsCalendarChart';
import DoctorsSexChart from './_components/DoctorsSexChart';
import DoctorsCompletedAppointmentsChart from './_components/DoctorsCompletedAppointmentsChart';
import MedicalServicesInsights from './_components/MedicalServicesInsights';
import MedicalInsights from './_components/MedicalInsights';

import { getAuthSession, getUserRole } from '@/lib/auth';

export default async function Home() {
  const session = await getAuthSession();
  const { role } = await getUserRole();

  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
            Welcome back,{' '}
            <span className="text-primary">{`${role === 'doctor' ? 'Dr. ' : ''}${session?.user.firstName} ${session?.user.lastName}`}</span>
          </h1>
          <h2 className="text-base font-medium text-muted-foreground">
            {role === 'admin'
              ? 'Here are the latest statistics for your clinic, in addition to insights about your invocies, patients, doctors, and most common services.'
              : 'Here are the latest statistics for your patients, in addition to insights about their age, sex, and medical indofmration.'}
          </h2>
          {role === 'admin' ? <AdminStatistics /> : <DoctorStatistics />}
        </div>

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
