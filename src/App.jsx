import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import Nav from './components/nav/Nav';
import Footer from './components/footer/Footer';
import ScrollProgress from './components/helper/ScrollProgress';
import Home from './components/Home';
import ServiceDetail from './components/services/ServiceDetail';

function App() {
  const location = useLocation();

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
          <Route path="/" element={<Home />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default App;
