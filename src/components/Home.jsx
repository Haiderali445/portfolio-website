import React from 'react';
import Header from './header/Header';
import About from './about/About';
import Skills from './skills/Skills';
import Experience from './experience/Experience';
import Solutions from './solutions/Solutions';
import Projects from './projects/Projects';
import Services from './services/Services';
import Testimonials from './testimonials/Testimonials';
import Contact from './contact/Contact';

const Home = () => {
    return (
        <main className="flex flex-col w-full overflow-hidden">
            <Header />
            <About />
            <Skills />
            <Experience />
            <Solutions />
            <Projects />
            <Services />
            <Testimonials />
            <Contact />
        </main>
    );
};

export default Home;
