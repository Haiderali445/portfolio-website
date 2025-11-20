import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { Toaster } from 'react-hot-toast';

import Header from './components/header/Header';
import Nav from './components/nav/Nav';
import Skills from './components/skills/Skills';  
import Testimonials from './components/testimonials/Testimonials';
import Services from './components/services/Services';
import Projects from './components/projects/Projects';
import Footer from './components/footer/Footer'; 
import HiderHeader from './components/hiderheader/HiderHeader';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import ScrollProgress from './components/helper/ScrollProgress';
import ParticleBackground from './components/helper/ParticleBackground';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: .05,           // smoother feel (1–1.5 is ideal)
      easing: (t) => 1 - Math.pow(1 - t, 3), // custom cubic ease-out
      smooth: true,            
      smoothTouch: true,       
      touchMultiplier: 1.5,    // makes touch scrolling feel natural
      infinite: false,         // keep normal behavior
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
    <>
      <ParticleBackground />
      <ScrollProgress />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-glass-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border-glow)',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: 'var(--color-bg)',
            },
          },
        }}
      />
      <ThemeToggle />
      <HiderHeader />
      <Header /> 
      <Nav />
      <About />
      <Skills />
      <Projects />
      <Services />     
      <Testimonials />
      <Contact />
      <Footer />        
    </>
  );
}

export default App;
