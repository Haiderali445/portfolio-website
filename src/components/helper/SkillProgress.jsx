import React, { useEffect, useState } from 'react';
import './SkillProgress.css';

const SkillProgress = ({ skill, percentage, delay = 0 }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div className="skill-progress-item">
      <div className="skill-progress-header">
        <span className="skill-progress-name">{skill}</span>
        <span className="skill-progress-percentage">{percentage}%</span>
      </div>
      <div className="skill-progress-bar">
        <div 
          className="skill-progress-fill" 
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export default SkillProgress;
