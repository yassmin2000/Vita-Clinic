import BookingsList from './_components/BookingsList';

export default function DevicesPage() {
  return (
    <section className="container mx-auto px-4 py-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Bookings
          </h2>
          <h3 className="text-base text-muted-foreground">
            View all your bookings, past and upcoming.
          </h3>
        </div>
        <BookingsList />
      </div>
    </section>
  );
}
