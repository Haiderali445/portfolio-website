import React, { useState } from 'react';
import { projectsData } from '../../utils/data/projects-data';
import './Project.css';
import { FaGithub, FaEye } from 'react-icons/fa';  // Importing React Icons

const Projects = () => {
  const [visibleProjects, setVisibleProjects] = useState(4);
  const showMore = () => {
    setVisibleProjects(projectsData.length);
  };

  const displayedProjects = projectsData.slice(0, visibleProjects);

  return (
    <section id="projects" className="projects">
      <h2>Projects</h2>
      <div className="container projects__container">
        <div className="projects__grid">
          {displayedProjects.map((project) => (
            <div key={project.id} className={`project__item ${project.inprogress ? 'project__item--inprogress' : ''}`}>
              {project.inprogress && (
                <div className="project__banner">In Progress</div>
              )}
              {/* Image */}
              <div className="project__image-wrapper">
                {project.images && (
                  <img src={project.images} alt={project.name} className="project__image" />
                )}
              </div>
              <div className="project__content">
                <h3>{project.name}</h3>
                <p className="project__description">{project.description}</p>
                <div className="project__tech">
                  {project.tools.map((tool, index) => (
                    <span key={index} className="project__tech-item">{tool}</span>
                  ))}
                </div>
                <div className="tile-divider"></div>

                <div className="project__links">
                  {project.code && (
                    <a href={project.code} className="project__link" target="_blank" rel="noopener noreferrer" aria-label="View Code">
                      <FaGithub size={24} />{/*Code for Git Hub Logo*/}
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} className="project__link project__link--primary" target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                      <FaEye size={24} /> {/* React Icon for Live Demo */}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Show More Button - IN the grid! */}
          {displayedProjects.length < projectsData.length && (
            <div key="show-more" className="show-more-container">
              <button onClick={showMore} className="show-more-btn">
                <span className="show-more-text">Show More</span>
                <span className="show-more-icon">+</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;