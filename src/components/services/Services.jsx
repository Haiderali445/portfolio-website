import React from 'react';
import { FaCog, FaCode, FaGlobe, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const iconMap = {
    Business: FaCog,
    Website: FaCode,
    WebApps: FaGlobe,
    // default
    Default: FaGlobe
};

const Services = ({ services = [] }) => {
    return (
        <section id="services" className="py-32 relative z-10">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-20">
                    <h2 className="text-4xl md:text-6xl font-sans font-bold mb-6 text-white leading-tight">
                        Engineering <br />
                        <span className="text-text-muted">Solutions</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => {
                        const isFeatured = index === 0;
                        const IconComponent = iconMap[service.iconType] || iconMap.Default;

                        return (
                            <Link
                                to={`/services/${service.id}`}
                                key={index}
                                className={`group relative p-8 rounded-[2rem] border border-white/5 bg-glass backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/10 cursor-pointer ${isFeatured ? 'lg:col-span-2' : ''}`}
                            >
                                {/* Shimmer Effect for Featured Card */}
                                {isFeatured && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                                )}

                                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:rotate-12 group-hover:scale-110 ease-out">
                                    <IconComponent size={120} />
                                </div>

                                <div className="relative z-10 flex flex-col justify-between h-full min-h-[280px]">
                                    <div>
                                        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white text-white group-hover:text-black transition-colors duration-300">
                                            <IconComponent size={24} />
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 max-w-md">
                                            {service.name}
                                        </h3>

                                        <p className="text-text-muted leading-relaxed max-w-sm">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="mt-8 flex items-center gap-2 text-sm font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        <span>View Deep Dive</span>
                                        <FaArrowRight />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;