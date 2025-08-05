import React from "react";
import "./About.css";
import { personalData } from "../../utils/data/personal-data";
import { useState } from "react";
import mypic from "../../Assets/images/img2.png";


  



const About = () => {
    const [copied, setCopied] = useState("");

  const handleCopy = (method) => {
    navigator.clipboard.writeText(personalData.phone);
    setCopied(method);
    setTimeout(() => setCopied(""), 2000);
  };
  return (
    <section className="about section-transition" id="about">
      <h2 className="section-title">About Me</h2>

      <div className="about-container">
        {/* === Left Side: Profile Card === */}
        <div className="about-left about-card glass-style">
          <img
            src={mypic}
            alt={personalData.name}
            className="about-image"
          />
          <div
            className="about-description"
            dangerouslySetInnerHTML={{ __html: personalData.description }}
          />
        </div>

        {/* === Right Side: Code Box + Chai === */}
        <div className="about-right">
          <div className="code-box glass-style">
            <div className="code-header">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <pre className="code-content">
              <code>
                <span className="brace">{"{"}</span>
                <br />
                <span className="key"> "name"</span>:{" "}
                <span className="value">"{personalData.name}"</span>,<br />
                <span className="key"> "designation"</span>:{" "}
                <span className="value">"{personalData.designation}"</span>,
                <br />
                <span className="key"> "email"</span>:{" "}
                <span className="value">"{personalData.email}"</span>,<br />
                <span className="key"> "phone"</span>:{" "}
                <span className="value">"{personalData.phone}"</span>,<br />
                <span className="key"> "address"</span>:{" "}
                <span className="value">"{personalData.address}"</span>,<br />
                <span className="key"> "availableForWork"</span>:{" "}
                <span className="boolean">true</span>,<br />
                <span className="key"> "github"</span>:{" "}
                <span className="value">"{personalData.github}"</span>,<br />
                <span className="key"> "interests"</span>:{" "}
                <span className="array">
                  ["React", "Mern", "BACKEND", "databases" ,"UI/UX", "Open Source", "Cloud", "Debugging at 3AM 🧠"]
                </span>
                ,<br />
                <span className="key"> "funFact"</span>:{" "}
                <span className="value">
                  "I console.log life before debugging it 😎"
                </span>
                <br />
                <span className="brace">{"}"}</span>
              </code>
            </pre>
          </div>

          {/* === Buy Me a Chai Box === */}
          {/* === Buy Me a Chai Box === */}
        <div className="chai-support glass-style">
        <h3 className="chai-title">GET ME A CHAI ☕</h3>
        <p className="chai-note">
          Send your support to the number below via Easypaisa or SadaPay 💸
        </p>
        <div className="chai-links" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {/* Easypaisa */}
          <div className="chai-link">
            <img
              src="data:image/png;base64,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"
              alt="EasyPaisa"
            />
            <button
              className={`copy-btn ${copied === "easypaisa" ? "copied" : ""}`}
              onClick={() => handleCopy("easypaisa")}
            >
              {copied === "easypaisa" ? "✔" : "Copy Number"}
            </button>
          </div>

          {/* SadaPay */}
          <div className="chai-link">
            <img
              src="data:image/jpeg;base64,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"
              alt="SadaPay"
            />
            <button
              className={`copy-btn ${copied === "sadapay" ? "copied" : ""}`}
              onClick={() => handleCopy("sadapay")}
            >
              {copied === "sadapay" ? "✔" : "Copy Number"}
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
