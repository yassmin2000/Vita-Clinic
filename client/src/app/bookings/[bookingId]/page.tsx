import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import BookingDetailsCard from './_components/BookingDetailsCard';
import BookingReports from './_components/BookingReports';
import BookingScans from './_components/BookingScans';
import BookingDetailsCardSkeleton from './_components/BookingDetailsCardSkeleton';

interface BookingPageProps {
  params: {
    bookingId: string;
  };
}

export default async function BookingPage({
  params: { bookingId },
}: BookingPageProps) {
  return (
    <section className="container mx-auto px-4 py-4">
      <div className="flex flex-col gap-6">
        <Suspense fallback={<BookingDetailsCardSkeleton />}>
          <BookingDetailsCard />
          <BookingReports id={bookingId} />
          <Separator className="my-1" />
          <BookingScans id={bookingId} />
        </Suspense>
      </div>
    </section>
  );
}
