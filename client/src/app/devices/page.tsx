import DeviceCardsGrid from './_components/DeviceCardsGrid';

export default function DevicesPage() {
  return (
    <section className="container mx-auto px-4 py-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Devices
          </h2>
          <h3 className="text-base text-muted-foreground">
            Manage all the devices in your organization.
          </h3>
        </div>
        <DeviceCardsGrid />
      </div>
    </section>
  );
}
