import React from 'react';
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
  )
}

export default App;
