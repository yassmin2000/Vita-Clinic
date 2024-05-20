import { getAuthSession } from '@/lib/auth';
import LatestVitals from './_component/LatestVitals';
import VitalsChart from './_component/VitalsChart';

export default async function page() {
  const session = await getAuthSession();

  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
            Welcome back,{' '}
            <span className="text-primary">{`${session?.user.firstName} ${session?.user.lastName}`}</span>
          </h1>
          <h2 className="text-base font-medium text-muted-foreground">
            Here are your latest vitals. If you have any questions, please
            contact one of our doctors.
          </h2>
          <LatestVitals />
        </div>
        <VitalsChart />
      </div>
    </section>
  );
}
