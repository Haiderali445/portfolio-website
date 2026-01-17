import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = ({ personalData }) => {
  return (
    <footer className="footer py-12 border-t border-white/5 bg-black text-center relative z-10 overflow-hidden">
      <div className="container mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white mb-2">{personalData.name}</h2>
            <p className="text-text-muted text-sm max-w-xs">
              Crafting digital experiences with code and passion. Open for collaborations.
            </p>
          </div>

          <div className="text-right">
            {/* Core Stack Manifest */}
            <div className="inline-block text-left p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <p className="text-xs font-mono text-text-muted mb-2 border-b border-white/5 pb-1">:: CORE STACK ::</p>
              <pre className="text-[10px] md:text-xs font-mono text-green-400/80 leading-relaxed">
                {`const stack = {
  os: "Linux",
  editor: "Cursor",
  shell: "ZSH",
  framework: "React/Vite",
  style: "Tailwind"
};`}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-sm text-text-muted font-mono">
          <p>© {new Date().getFullYear()} {personalData.name}. All rights reserved.</p>
          <p>Designed & Built with <span className="text-red-500">♥</span></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
