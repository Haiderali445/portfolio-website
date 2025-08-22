import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

import Header from './components/header/Header';
import Nav from './components/nav/Nav';
import Skilss from './components/skills/Skilss';  
import Testem from './components/testimonials/Testem';
import Services from './components/services/Services';
import Projects from './components/projects/Projects';
import Footer from './components/footer/Footer'; 
import HiderHeader from './components/hiderheader/HiderHeader';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';

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
      <ThemeToggle />
      <HiderHeader />
      <Header /> 
      <Nav />
      <About />
      <Skilss />
      <Projects />
      <Services />     
      <Testem />
      <Contact />
      <Footer />        
    </>
  );
}

export default App;
