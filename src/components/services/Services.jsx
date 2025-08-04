import React from 'react';
import { servicesData } from '../../utils/data/services-data';
import { planData } from '../../utils/data/plan-data';
import './Services.css';
import { FaCog, FaCode, FaGlobe, FaCheck, FaTimes } from 'react-icons/fa';

const Services = () => {
    return (
        <section id="services" className="services">
            <div className="container services__container">
                <h2>Services</h2>

                {/* Service Categories */}
                <div className="service__categories">
                    {servicesData.map((service) => (
                        <div key={service.id} className="service__category">
                            {(() => {
                                switch (service.name) {
                                    case "Custom Business Solutions":
                                        return <FaCog size={48} className="service__icon" />;
                                    case "Modern Website Development":
                                        return <FaCode size={48} className="service__icon" />;
                                    case "Innovative Web Applications":
                                        return <FaGlobe size={48} className="service__icon" />;
                                    default:
                                        return <FaCog size={48} className="service__icon" />; // Default icon
                                }
                            })()}
                            <h3>{service.name}</h3>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>

                {/* Service Plans */}
                <h2>Plans</h2>
                <div className="plan__container">
                    {planData.map((plan) => (
                        <div key={plan.id} className={`plan__item ${plan.featured ? 'plan__item--featured' : ''}`}>
                            <h3>{plan.name}</h3>
                            <p className="plan__price">{plan.price}</p>
                            <ul className="plan__features">
                                <li>Pages: {plan.pages}</li>
                                <li>AWS/Cloud: {plan.aws ? <FaCheck /> : <FaTimes />}</li>
                                <li>Database: {plan.database ? <FaCheck /> : <FaTimes />}</li>
                                <li>Authentication: {plan.auth ? <FaCheck /> : <FaTimes />}</li>
                                <li>Database Size: {plan.databaseSize}</li>
                            </ul>
                            <a href="#contact" className="btn">Get Connected</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;