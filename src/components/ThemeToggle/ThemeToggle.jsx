import React, { useEffect, useState } from 'react';
import './ThemeToggle.css';

function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.classList.add('light');
      setIsLight(true);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle('light');
    const newTheme = html.classList.contains('light');
    setIsLight(newTheme);
    localStorage.setItem('theme', newTheme ? 'light' : 'dark');
  };

  return (
    <div className="theme-slider" onClick={toggleTheme}>
      <div className={`slider-thumb ${isLight ? 'light' : 'dark'}`}>
        {isLight ? '☀️' : '🌙'}
      </div>
    </div>
  );
}

export default ThemeToggle;
