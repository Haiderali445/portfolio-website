import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import Nav from './components/nav/Nav';
import Footer from './components/footer/Footer';
import ScrollProgress from './components/helper/ScrollProgress';
import Home from './components/Home';
import ServiceDetail from './components/services/ServiceDetail';

import { usePortfolioData } from './hooks/usePortfolioData';

function App() {
  console.log('Mounting App...'); // Debug: App mount start
  const location = useLocation();
  const { data, loading, error } = usePortfolioData();

  // Safe Destructuring
  const { personal, projects, experience, services, skills, contacts, testimonials, solutions } = data || {};

  // Debug Log
  console.log("App Render - Loading:", loading, "Data:", data, "Error:", error);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  if (loading) return <div className='h-screen w-full bg-[#050505] flex items-center justify-center text-white font-mono'>INITIALIZING SYSTEM...</div>;

  // Fail-safe for error or null data
  if (error || !data) return <div className='h-screen w-full bg-[#050505] flex items-center justify-center text-red-500'>ERROR: DATA_LOAD_FAILED</div>;

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30 font-sans">
      <ScrollProgress />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(5, 5, 5, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />

      {/* Navigation - Only show on Home for now, or keep globally but sticky? 
          User asked for "Back to Services" button on detail page, implying Nav might not be primary there or could be distracting.
          But floating dock is nice. Let's keep it generally, or maybe hide it on detail page if user requested specific "Back" button focus.
          For now, I'll leave it. It's unique.
      */}
      <Nav />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home portfolioData={data} />} />
          <Route path="/services/:serviceId" element={<ServiceDetail services={services} />} />
        </Routes>
      </AnimatePresence>

      <Footer personalData={personal} />
    </div>
  );
}

export default App;
