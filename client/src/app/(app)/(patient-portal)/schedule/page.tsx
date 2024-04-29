'use client';

import ScheduleForm from './_components/ScheduleForm';

export default function SchedulePage() {
  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Schedule
          </h2>
          <h3 className="text-base text-muted-foreground">
            Schedule an appointment for your next visit.
          </h3>
        </div>

        <ScheduleForm />
      </div>
    </section>
  );
}
