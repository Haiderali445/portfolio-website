import React from 'react'
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import  {personalData} from '../../utils/data/personal-data'

const SocialIcons = () => {
  return (
    <div className="social-icons">
      <a href={personalData.github} target="_blank" rel="noreferrer">
        <FaGithub />
      </a>
      <a href={personalData.linkedIn} target="_blank" rel="noreferrer">
        <FaLinkedin />
      </a>
      <a href={personalData.instagram} target="_blank" rel="noreferrer">
        <FaInstagram />
      </a>

      {/* Decorative Line */}
      <div className="social-line" />
    </div>
  )
}

export default SocialIcons
