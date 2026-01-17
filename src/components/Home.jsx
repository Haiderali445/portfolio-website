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

const Home = ({ portfolioData }) => {
    // Debug Log
    console.log("Home Render - PortfolioData:", portfolioData);

    if (!portfolioData) return null; // Safety guard

    return (
        <main className="flex flex-col w-full overflow-hidden">
            <Header personalData={portfolioData?.personal} />
            <About personalData={portfolioData?.personal} />
            {/* Skills not yet refactored to accept props, but we can pass anyway or leave as is */}
            <Skills skills={portfolioData?.skills} />
            <Experience experiences={portfolioData?.experience} />
            <Solutions solutions={portfolioData?.solutions} />
            <Projects projects={portfolioData?.projects} />
            <Services services={portfolioData?.services} />
            <Testimonials testimonials={portfolioData?.testimonials} />
            <Contact contactInfo={portfolioData?.contacts} />
        </main>
    );
};

export default Home;
