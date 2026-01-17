import React, { useState } from "react";
import mypic from "../../assets/images/img2.png";
import { FaCircle } from "react-icons/fa";

const About = ({ personalData }) => {
  const [copied, setCopied] = useState("");

  const handleCopy = (method) => {
    navigator.clipboard.writeText(personalData.phone);
    setCopied(method);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-4xl md:text-6xl font-sans font-bold mb-16 text-center text-white">
          About <span className="text-text-muted">Me</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* === Left Side: Galaxy Profile Box === */}
          <div className="order-1 relative group w-full h-full">
            {/* Galaxy Glow - Permanent & Intensified */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-[2.5rem] blur-2xl group-hover:blur-3xl opacity-20 group-hover:opacity-60 transition-all duration-700" />

            <div className="relative h-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] flex flex-col justify-center items-center text-center gap-8 transform transition-all duration-500 hover:border-white/10 hover:shadow-2xl hover:shadow-primary/10">
              {/* Profile Image Circle */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10 mix-blend-overlay z-10" />
                <img
                  src={mypic}
                  alt={personalData.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>

              {/* Name & Title */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{personalData.name}</h3>
                <p className="text-primary font-mono text-sm tracking-wider uppercase mb-8">{personalData.designation}</p>
              </div>

              {/* Description Text */}
              <div
                className="text-text-muted text-sm md:text-base leading-relaxed text-justify max-w-lg"
                dangerouslySetInnerHTML={{ __html: personalData.description }}
              />
            </div>
          </div>

          {/* === Right Side: Description & Code Box === */}
          <div className="order-2 flex flex-col gap-8 justify-center h-full">

            {/* Code Box */}
            <div className="rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-50 text-xs font-mono text-white/20">developer.json</div>

              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                <FaCircle className="text-red-500 text-[10px]" />
                <FaCircle className="text-yellow-500 text-[10px]" />
                <FaCircle className="text-green-500 text-[10px]" />
              </div>

              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-xs md:text-sm text-green-400/90 leading-relaxed">
                  <code>
                    <span className="text-purple-400">{"{"}</span>
                    <br />
                    &nbsp;&nbsp;<span className="text-blue-400">"name"</span>: <span className="text-yellow-300">"{personalData.name}"</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-400">"role"</span>: <span className="text-yellow-300">"{personalData.designation}"</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-400">"email"</span>: <span className="text-yellow-300">"{personalData.email}"</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-400">"status"</span>: <span className="text-orange-400">"Open for Innovation"</span>,<br />
                    &nbsp;&nbsp;<span className="text-blue-400">"interests"</span>: <span className="text-purple-400">[</span>
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">"Architecture"</span>, <span className="text-yellow-300">"AI Integration"</span>,<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">"Cloud Native"</span>, <span className="text-yellow-300">"UX Engineering"</span>
                    <br />
                    &nbsp;&nbsp;<span className="text-purple-400">]</span>
                    <br />
                    &nbsp;&nbsp;<span className="text-purple-400">{"}"}</span>
                  </code>
                </pre>
              </div>
            </div>

            {/* === Buy Me a Chai Box === */}
            <div className="p-6 rounded-2xl glass-card bg-white/[0.03] border border-white/[0.08] flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                Fuel the Code ☕
              </h3>
              <p className="text-text-muted text-sm mb-6 max-w-sm">
                Innovative solutions require high-octane chai. Support the craft!
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleCopy("easypaisa")}
                  className={`px-4 py-2 text-xs font-mono rounded-lg border transition-all ${copied === 'easypaisa' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  {copied === 'easypaisa' ? "Number Copied!" : "EasyPaisa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
