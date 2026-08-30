import React from 'react';
import { TourProvider, useTour } from './context/TourContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FloatingInfo } from './components/FloatingInfo';
import { EmotionalIntro } from './components/EmotionalIntro';
import { WhatsIncluded } from './components/WhatsIncluded';
import { PriceSection } from './components/PriceSection';
import { SeatSelector } from './components/SeatSelector';
import { TourTimeline } from './components/TourTimeline';
import { FoodExperience } from './components/FoodExperience';
import { GallerySection } from './components/GallerySection';
import { MemorySection } from './components/MemorySection';
import { BookingSteps } from './components/BookingSteps';
import { InterestedSection } from './components/InterestedSection';
import { FaqSection } from './components/FaqSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { TicketModal } from './components/TicketModal';
import { AdminLayout } from './components/admin/AdminLayout';

const MainContent: React.FC = () => {
  const { isAdminView } = useTour();

  return (
    <>
      {isAdminView ? (
        <AdminLayout />
      ) : (
        <div className="website-page-content min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col print:hidden">
          {/* 1. Transparent Navigation */}
          <Navbar />

          {/* 2. Cinematic Hero */}
          <Hero />

          {/* 3. Floating Tour Glass Info */}
          <FloatingInfo />

          {/* 4. Emotional Intro / Magazine Editorial */}
          <EmotionalIntro />

          {/* 5. What's Included */}
          <WhatsIncluded />

          {/* 6. Price Presentation */}
          <PriceSection />

          {/* 7. Seat Experience & Live Selection */}
          <SeatSelector />

          {/* 8. Tour Timeline / Itinerary */}
          <TourTimeline />

          {/* 9. Food & Lifestyle Experience */}
          <FoodExperience />

          {/* 10. Editorial Gallery with Lightbox */}
          <GallerySection />

          {/* 11. Sunset Memory Section */}
          <MemorySection />

          {/* 12. Simple Human Booking Steps */}
          <BookingSteps />

          {/* 13. Interested / Waitlist Section */}
          <InterestedSection />

          {/* 14. FAQ Accordion */}
          <FaqSection />

          {/* 15. Final Spectacular Sunset CTA */}
          <FinalCta />

          {/* 16. Footer */}
          <Footer />
        </div>
      )}

      {/* Global Interactive Modals (Shared across Public & Admin views) */}
      <BookingModal />
      <TicketModal />
    </>
  );
};

export default function App() {
  return (
    <TourProvider>
      <MainContent />
    </TourProvider>
  );
}
