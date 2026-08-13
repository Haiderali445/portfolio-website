import React from 'react';
import Header from '../components/header/Header';
import About from '../components/about/About';
import Skills from '../components/skills/Skills';
import Experience from '../components/experience/Experience';
import Education from '../components/education/Education';
import Solutions from '../components/solutions/Solutions';
import Projects from '../components/projects/Projects';
import Services from '../components/services/Services';
import Testimonials from '../components/testimonials/Testimonials';
import Contact from '../components/contact/Contact';
import MetaTags from '../components/common/MetaTags';

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
