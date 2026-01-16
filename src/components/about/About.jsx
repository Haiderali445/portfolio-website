import React, { useState } from "react";
import { personalData } from "../../utils/data/personal-data";
import mypic from "../../Assets/images/img2.png";
import { FaCircle } from "react-icons/fa";

const About = () => {
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
          {/* === Left Side: Profile Card === */}
          <div className="relative group perspective">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative p-8 rounded-3xl glass-card bg-white/[0.03] border border-white/[0.08] transform transition-transform duration-500 hover:rotate-y-2">
              <div className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white/5 shadow-2xl">
                <img
                  src={mypic}
                  alt={personalData.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div
                className="text-text-muted leading-relaxed text-sm md:text-base text-justify"
                dangerouslySetInnerHTML={{ __html: personalData.description }}
              />
            </div>
          </div>

          {/* === Right Side: Code Box + Chai === */}
          <div className="flex flex-col gap-8">
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
