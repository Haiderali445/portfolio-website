import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './SkillChart.css';

const SkillChart = () => {
  // Organized by category
  const frontendSkills = [
    { name: 'React', level: 90 },
    { name: 'JavaScript', level: 95 },
    { name: 'TypeScript', level: 80 },
    { name: 'HTML/CSS', level: 92 },
  ];

  const backendSkills = [
    { name: 'Node.js', level: 85 },
    { name: 'Express.js', level: 88 },
    { name: 'MongoDB', level: 85 },
    { name: 'PostgreSQL', level: 75 },
  ];

  const toolsSkills = [
    { name: 'Git', level: 90 },
    { name: 'Docker', level: 70 },
    { name: 'AWS', level: 65 },
    { name: 'VS Code', level: 95 },
  ];

  const getColor = (value) => {
    if (value >= 90) return '#00eaff';
    if (value >= 80) return '#00d4ff';
    if (value >= 70) return '#00bfff';
    return '#00aaff';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.name}</p>
          <p className="tooltip-value">{payload[0].value}% Proficiency</p>
        </div>
      );
    }
    return null;
  };

  const renderChart = (data, title) => (
    <div className="skill-chart-section">
      <h4 className="chart-category-title">{title}</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis type="number" domain={[0, 100]} stroke="#00eaff" />
          <YAxis type="category" dataKey="name" stroke="#00eaff" width={100} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 234, 255, 0.1)' }} />
          <Bar dataKey="level" radius={[0, 10, 10, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.level)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="skill-chart-container">
      <h3 className="skill-chart-main-title">Technical Proficiency</h3>
      <p className="skill-chart-subtitle">Expertise levels across different technologies</p>
      
      <div className="charts-grid">
        {renderChart(frontendSkills, '🎨 Frontend Development')}
        {renderChart(backendSkills, '⚙️ Backend Development')}
        {renderChart(toolsSkills, '🛠️ Tools & Technologies')}
      </div>

      {/* Legend */}
      <div className="skill-legend">
        <div className="legend-item">
          <span className="legend-dot expert"></span>
          <span>Expert (90-100%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot advanced"></span>
          <span>Advanced (80-89%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot intermediate"></span>
          <span>Intermediate (70-79%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot beginner"></span>
          <span>Learning (60-69%)</span>
        </div>
      </div>
    </div>
  );
};

export default SkillChart;
