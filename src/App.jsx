import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import Nav from './components/nav/Nav';
import Footer from './components/footer/Footer';
import ScrollProgress from './components/helper/ScrollProgress';
import Home from './components/Home';
import ServiceDetail from './components/services/ServiceDetail';

import { usePortfolioData } from './hooks/usePortfolioData';

function App() {
  const location = useLocation();
  const { data, loading, error } = usePortfolioData();

  const { personal, services } = data || {};

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

  // Reset scroll on route changes cleanly
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated Glow Backdrop */}
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />

        <div className="relative z-10 p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col items-center gap-6 shadow-2xl">
          <div className="relative flex items-center justify-center w-16 h-16">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-30" />
            <div className="w-12 h-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
          </div>
          <p className="text-sm font-mono text-cyan-400 tracking-widest uppercase animate-pulse">
            INITIALIZING SYSTEM...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center text-red-500 font-mono">
        <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20 backdrop-blur-xl text-center">
          <h2 className="text-xl font-bold mb-2">ERROR: DATA_LOAD_FAILED</h2>
          <p className="text-sm text-gray-400">Please check system logs or backend connectivity.</p>
        </div>
      </div>
    );
  }

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
