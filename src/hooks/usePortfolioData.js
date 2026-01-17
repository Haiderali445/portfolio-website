import { useState, useEffect } from 'react';
import { personalData } from '../utils/data/personal-data';
import { projectsData } from '../utils/data/projects-data';
import { experienceData } from '../utils/data/experience-data';
import { servicesData } from '../utils/data/services-data';
import { skillsData } from '../utils/data/skills';
import { contactsData } from '../utils/data/contactsData';
import { testimonialData } from '../utils/data/testem-data';
import { solutionsData } from '../utils/data/solutionsData';
// import { educations } from '../utils/data/educations'; // Optional if needed

export const usePortfolioData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate API Call
        const fetchData = async () => {
            console.log("usePortfolioData: Fetching data...");
            try {
                setLoading(true);
                // In the future, this will be:
                // const response = await apiClient.get('/portfolio');
                // setData(response.data);

                // Mock Delay
                await new Promise(resolve => setTimeout(resolve, 100));

                setData({
                    personal: personalData,
                    projects: projectsData,
                    experience: experienceData,
                    services: servicesData,
                    skills: skillsData,
                    contacts: contactsData,
                    testimonials: testimonialData,
                    solutions: solutionsData,
                });
            } catch (err) {
                setError(err);
                console.error("Error fetching portfolio data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};
