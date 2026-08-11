import React from 'react';
import Header from './header/Header';
import About from './about/About';
import Skills from './skills/Skills';
import Experience from './experience/Experience';
import Education from './education/Education';
import Solutions from './solutions/Solutions';
import Projects from './projects/Projects';
import Services from './services/Services';
import Testimonials from './testimonials/Testimonials';
import Contact from './contact/Contact';
import MetaTags from './common/MetaTags';

const Home = ({ portfolioData }) => {
    if (!portfolioData) return null;

    const { personal, skills, experience, education, solutions, projects, services, testimonials, contacts } = portfolioData;

    return (
        <main className="flex flex-col w-full overflow-hidden">
            <MetaTags
                title={`${personal?.name || 'Haider Ali'} | ${personal?.designation || 'Software Developer & System Architect'}`}
                description="Visionary Full-Stack Software Engineer, system design specialist, and backend developer."
            />
            <Header personalData={personal} />
            <About personalData={personal} />
            <Skills skills={skills} />
            <Experience experiences={experience} />
            <Education educations={education} />
            <Solutions solutions={solutions} personalData={personal} />
            <Projects projects={projects} personalData={personal} />
            <Services services={services} />
            <Testimonials testimonials={testimonials} />
            <Contact contactInfo={contacts} personalData={personal} />
        </main>
    );
};

export default Home;
