import AdminsTable from './_components/AdminsTable';

export default function AdminsPage() {
  return (
    <section className="container px-4 mx-auto py-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Admins
          </h2>
          <h3 className="text-base text-muted-foreground">
            Manage all the admins in your organization, and add new admins.
          </h3>
        </div>

        <AdminsTable />
      </div>
    </section>
  );
}
