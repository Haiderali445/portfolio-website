import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';
import MagneticButton from '../helper/MagneticButton';
import { FaArrowLeft } from 'react-icons/fa';

const ServiceDetail = ({ services = [] }) => {
    const { serviceId } = useParams();
    const navigate = useNavigate();

    // Find service data
    const service = services?.find(s => s.id === parseInt(serviceId));

    // Quick Safety Guard
    if (!service) return null;

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!service) {
        return (
            <div className="h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
                <button onClick={() => navigate('/')} className="text-primary hover:underline">Return Home</button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', ease: 'anticipate', duration: 0.8 }}
            className="min-h-screen pt-32 pb-20 px-6 container mx-auto max-w-5xl relative z-10"
        >
            {/* Back Button */}
            <div className="mb-12">
                <MagneticButton onClick={() => {
                    navigate('/');
                    setTimeout(() => {
                        const servicesSection = document.getElementById('services');
                        if (servicesSection) {
                            servicesSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 100);
                }}>
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-mono cursor-pointer">
                        <FaArrowLeft /> Back to Services
                    </div>
                </MagneticButton>
            </div>

            {/* Header Section */}
            <div className="mb-20">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold font-sans mb-6 text-white"
                >
                    {service.name}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-text-muted max-w-2xl leading-relaxed"
                >
                    {service.description}
                </motion.p>
            </div>

            {/* Tech Stack Used */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-24"
            >
                <h3 className="text-sm font-mono text-primary mb-8 uppercase tracking-widest border-b border-white/10 pb-2 inline-block">Tech Stack Used</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {service.fullTechStack?.map((tech, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                            <span className="text-sm font-medium text-white/80">{tech}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* System Architecture (Problem/Solution) */}
            <div className="mb-24">
                <h3 className="text-sm font-mono text-primary mb-8 uppercase tracking-widest border-b border-white/10 pb-2 inline-block">System Architecture</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl glass-card border border-red-500/10 bg-red-500/5"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">The Challenge</h3>
                        <p className="text-text-muted leading-relaxed">
                            {service.problem || "Organizations face scalability and maintenance hurdles when legacy systems fail to adapt to modern throughput demands."}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl glass-card border border-green-500/10 bg-green-500/5"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">The Solution</h3>
                        <p className="text-text-muted leading-relaxed">
                            {service.solution || "We implement an event-driven architecture that ensures decoupling, high availability, and seamless data consistency across services."}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Implementation Roadmap */}
            <div className="mb-12">
                <h3 className="text-sm font-mono text-primary mb-12 uppercase tracking-widest border-b border-white/10 pb-2 inline-block">Implementation Roadmap</h3>
                <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
                    {service.implementationSteps?.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative pl-8 md:pl-12"
                        >
                            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-black border-2 border-primary" />
                            <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                            <p className="text-text-muted max-w-xl">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

        </motion.div>
    );
};

export default ServiceDetail;
