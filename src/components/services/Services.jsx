import React, { useState } from 'react';
import { FaCog, FaCode, FaGlobe, FaArrowRight, FaCheck, FaTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const iconMap = {
    Business: FaCog,
    Website: FaCode,
    WebApps: FaGlobe,
    Default: FaGlobe
};

const Services = ({ services = [], pricing = [] }) => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // Dynamic interactive toggle if your data supports intervals

    return (
        <section id="services" className="py-32 relative z-10">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Services Section Header */}
                <div className="mb-20">
                    <h2 className="text-4xl md:text-6xl font-sans font-bold mb-6 text-white leading-tight">
                        Engineering <br />
                        <span className="text-text-muted">Solutions & Services</span>
                    </h2>
                    <p className="text-text-muted max-w-2xl text-base">
                        Explore specialized technical offerings tailored to architectural scaling, high-performance systems, and web execution.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-28">
                    {services.map((service, index) => {
                        const isFeatured = index === 0;
                        const IconComponent = iconMap[service.iconType] || iconMap.Default;

                        return (
                            <Link
                                to={`/services/${service.id}`}
                                key={service.id || index}
                                className={`group relative p-8 rounded-[2rem] border border-white/5 bg-glass backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/10 cursor-pointer ${isFeatured ? 'lg:col-span-2' : ''}`}
                            >
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

                                        <p className="text-text-muted leading-relaxed max-w-sm text-sm">
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

                {/* Pricing / Engagement Tiers Section (Dynamically powered by pricingService data) */}
                {pricing && pricing.length > 0 && (
                    <div className="mt-20 pt-16 border-t border-white/10">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs mb-4">
                                <FaTag size={10} />
                                <span>Engagement Models</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">Investment Tiers</h3>
                            <p className="text-text-muted max-w-xl mx-auto text-sm">
                                Transparent project structures designed for scale, flexibility, and production-ready code delivery.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pricing.map((plan, pIndex) => (
                                <motion.div
                                    key={plan.id || pIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: pIndex * 0.1 }}
                                    className={`relative p-8 rounded-[2rem] border transition-all duration-300 flex flex-col justify-between ${
                                        plan.isPopular || plan.popular 
                                            ? 'glass-card border-primary/50 bg-white/[0.07] shadow-xl shadow-primary/5 scale-[1.02]' 
                                            : 'glass-card border-white/5 bg-white/5 hover:border-white/10'
                                    }`}
                                >
                                    {(plan.isPopular || plan.popular) && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black font-mono font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                                            Most Popular
                                        </span>
                                    )}

                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">{plan.name || plan.title}</h4>
                                        <p className="text-text-muted text-xs mb-6 min-h-[36px]">{plan.description}</p>
                                        
                                        <div className="mb-8 flex items-baseline gap-1">
                                            <span className="text-4xl md:text-5xl font-bold text-white font-mono">
                                                {plan.price || plan.cost}
                                            </span>
                                            {plan.period && <span className="text-text-muted text-xs font-mono">/{plan.period}</span>}
                                        </div>

                                        {plan.features && plan.features.length > 0 && (
                                            <div className="space-y-3 mb-8 border-t border-white/5 pt-6">
                                                {plan.features.map((feature, fIndex) => (
                                                    <div key={fIndex} className="flex items-start gap-3 text-sm text-text-muted">
                                                        <FaCheck size={14} className="text-primary mt-0.5 shrink-0" />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <a
                                        href="#contact"
                                        className={`w-full py-4 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 text-center block ${
                                            plan.isPopular || plan.popular
                                                ? 'bg-primary text-black font-bold hover:opacity-90 shadow-lg shadow-primary/20'
                                                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                        }`}
                                    >
                                        {plan.cta || 'Get Started'}
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Services;