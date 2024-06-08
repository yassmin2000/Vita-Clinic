import Header from './_components/Header';
import Footer from './_components/Footer';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full bg-white">
      <Header />
      <main className="h-full bg-white">
        {children}
        <Footer />
      </main>
    </div>
  );
}
