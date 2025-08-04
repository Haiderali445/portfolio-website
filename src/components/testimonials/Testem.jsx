import React, { useState } from 'react';
import { testimonialData } from '../../utils/data/testem-data';
import './Testem.css';
import { FaHeart, FaStar } from 'react-icons/fa';

const Testem = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1 < testimonialData.length ? prev + 1 : null));
  };

  return (
    <section id="testimonials" className="testimonials">
      <h2>Testimonials</h2>

      <div className="testimonials__stack">
        {testimonialData.map((testimonial, i) => (
          <div
            key={testimonial.id}
            className="testimonial__card stacked-card"
            style={{
              transform: `rotate(${(i - 2) * 5}deg) translateY(${i * 12}px) scale(${1 - i * 0.02})`,
              zIndex: testimonialData.length - i,
            }}
            onClick={() => setActiveIndex(i)}
          >
            <img src={testimonial.image} alt={testimonial.name} className="testimonial__image" />
            <div className="testimonial__info">
              <h3>{testimonial.name}</h3>
              <p className="testimonial__title">{testimonial.title}, {testimonial.company}</p>
              <p className="testimonial__content">"{testimonial.testimonial}"</p>
              <div className="testimonial__actions">
                <div className="action"><FaHeart className="icon heart" /> {testimonial.likes}</div>
                <div className="action"><FaStar className="icon star" /> {testimonial.stars}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="testimonial__popup">
          <div className="popup__backdrop" onClick={() => setActiveIndex(null)} />
          <div className="popup__card">
            <div className="testimonial__card active">
              <img src={testimonialData[activeIndex].image} alt={testimonialData[activeIndex].name} className="testimonial__image" />
              <div className="testimonial__info">
                <h3>{testimonialData[activeIndex].name}</h3>
                <p className="testimonial__title">{testimonialData[activeIndex].title}, {testimonialData[activeIndex].company}</p>
                <p className="testimonial__content">"{testimonialData[activeIndex].testimonial}"</p>
                <div className="testimonial__actions">
                  <div className="action"><FaHeart className="icon heart" /> {testimonialData[activeIndex].likes}</div>
                  <div className="action"><FaStar className="icon star" /> {testimonialData[activeIndex].stars}</div>
                </div>
                <button className="popup__next" onClick={handleNext}>Next</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testem;
