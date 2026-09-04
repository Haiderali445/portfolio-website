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

    // Destructure dispatchers (including gmail) alongside your other data objects
    const { personal, skills, experience, education, solutions, projects, services, testimonials, contacts, dispatchers } = portfolioData;

    return (
        <main className="flex flex-col w-full overflow-x-clip">
            <MetaTags
                title={`${personal?.name || 'Haider Ali'} | ${personal?.designation || 'Software Developer & System Architect'}`}
                description="Visionary Full-Stack Software Engineer, system design specialist, and backend developer."
            />
            <Header personalData={personal} experience={experience} />
            <About personalData={personal} />
            <Skills skills={skills} isLoading={!Array.isArray(skills) || skills.length === 0} />
            <Experience experiences={experience} isLoading={!Array.isArray(experience) || experience.length === 0} />
            <Education educations={education} />
            <Solutions solutions={solutions} personalData={personal} isLoading={!Array.isArray(solutions) || solutions.length === 0} />
            <Projects projects={projects} personalData={personal} isLoading={!Array.isArray(projects) || projects.length === 0} />
            <Services services={services}/>
            <Testimonials testimonials={testimonials} />
            {/* Pass contactInfo and gmail dispatcher down to Contact component */}
            <Contact contactInfo={contacts} personalData={personal} gmailDispatcher={dispatchers?.gmail} />
        </main>
    );
};

export default Home;