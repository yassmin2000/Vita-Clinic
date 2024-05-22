import HeroSection from './_component/HeroSection';
import ServicesSection from './_component/ServicesSection';
import AboutSection from './_component/AboutSection';
import TestimonialsSection from './_component/TestimonialsSection';
import ContactSection from './_component/ContactSection';
import Footer from './_component/Footer';

export default function LandingPage() {
  return (
    <main className="h-full bg-white">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
