import React from 'react'
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { personalData } from '../../utils/data/personal-data'

const SocialIcons = () => {
  return (
    <div className="flex items-center gap-5 mt-8">
      {[
        { icon: FaGithub, link: personalData.github },
        { icon: FaLinkedin, link: personalData.linkedIn },
        { icon: FaInstagram, link: personalData.instagram }
      ].map((social, index) => (
        <a
          key={index}
          href={social.link}
          target="_blank"
          rel="noreferrer"
          className="text-text-muted hover:text-white transition-colors transform hover:-translate-y-1 hover:scale-110 duration-300"
        >
          <social.icon size={24} />
        </a>
      ))}
      {/* Decorative Line */}
      <div className="h-[1px] w-20 bg-glass-border ml-2" />
    </div>
  )
}

export default SocialIcons
