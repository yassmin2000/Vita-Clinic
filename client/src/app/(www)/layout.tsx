import Header from './_component/Header';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full bg-white">
      <Header />
      {children}
    </div>
  );
}
