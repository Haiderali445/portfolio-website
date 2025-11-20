import React from "react";
import Marquee from "react-fast-marquee";
import "./Skills.css";
import { skillsData } from "../../utils/data/skills";
import { skillsImage } from "../../utils/skill-image";
import { skillCategories } from "../../utils/data/skill-catagories";
import SkillChart from "../helper/SkillChart";
import "../helper/SkillChart.css";

function Skills() {
  return (
    <section  id="skills" className=" relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>

      {/* Decorative line */}
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <h2>SKILLS</h2>

      {/* Skill Cards in Auto Marquee */}
      <div className="skills-marquee-wrapper">
        <Marquee
          gradient={false}
          speed={80}
          pauseOnHover={true}
          pauseOnClick={true}
          delay={0}
          play={true}
          direction="left"
        >
          {skillsData.map((skill, id) => {
            const imageSrc = skillsImage(skill);
            return (
              <div className="skill-card" key={id}>
                <div className="skill-inner">
                  <div className="skill-glow-line" />
                  <div className="skill-content">
                    <div className="skill-icon-wrapper">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={skill}
                          className="skill-icon"
                        />
                      ) : (
                        <div className="skill-icon-placeholder">
                          Image Not Found
                        </div>
                      )}
                    </div>
                    <p className="skill-name">{skill}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Marquee>
      </div>

      {/* Skill Tiles Grid */}
      <div className="skills-tiles-wrapper">
        {skillCategories.map((category, index) => {
          const hasMore = category.skills.length > 5;
          const firstFive = category.skills.slice(0, 5);
          const remaining = category.skills.slice(5);

          return (
            <div key={index} className="skill-tile">
              <div className="tile-header">{category.title}</div>

              <div className="tile-icons">
                {firstFive.map((skill, i) => (
                  <img
                    key={i}
                    src={skillsImage(skill)}
                    alt={skill}
                    title={skill}
                    className="tile-icon"
                  />
                ))}
              </div>

              {hasMore && (
                <>
                  <div className="tile-more">+more</div>
                  <div className="tile-icons hidden-icons">
                    {remaining.map((skill, i) => (
                      <img
                        key={i}
                        src={skillsImage(skill)}
                        alt={skill}
                        title={skill}
                        className="tile-icon"
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="tile-divider"></div>
              <div className="tile-description">{category.description}</div>
            </div>
          );
        })}
      </div>

      {/* Skill Chart */}
      <SkillChart />
    </section>
  );
}

export default Skills;
