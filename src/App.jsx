import React from 'react';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer'; 
function App() {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen transition-colors">
      <header className="p-4 flex justify-between items-center">
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#home" className="hover:text-yellow-400 transition-colors">Home</a></li>
            <li><a href="#portfolio" className="hover:text-yellow-400 transition-colors">Portfolio</a></li>
            <li><a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="portfolio">
          <Portfolio />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
