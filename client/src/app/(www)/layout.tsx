import Header from './_component/Header';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full">
      <Header />
      <main className="h-full">{children}</main>
    </div>
  );
}
