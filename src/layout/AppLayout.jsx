// src/components/layout/AppLayout.jsx
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

import Nav from "../components/nav/Nav";
import Footer from "../components/footer/Footer";
import ScrollProgress from "../components/helper/ScrollProgress";
import CommandTerminal from "../components/helper/CommandTerminal";
import AIChatWidget from "../components/helper/AIChatWidget";
import Home from "../views/Home";
import ServiceDetail from "../views/ServiceDetail";

export default function AppLayout({ data }) {
  const location = useLocation();
  const { personal, services, projects } = data;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-white selection:bg-primary/30 font-sans">
      <ScrollProgress />
      <CommandTerminal portfolioData={data} />
      <AIChatWidget />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(5, 5, 5, 0.8)",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
          },
        }}
      />
      <Nav />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home portfolioData={data} />} />
          <Route
            path="/services/:serviceId"
            element={<ServiceDetail services={services} projects={projects} />}
          />
        </Routes>
      </AnimatePresence>
      <Footer personalData={personal} />
    </div>
  );
}