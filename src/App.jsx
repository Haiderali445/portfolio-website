// src/App.jsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortfolioData } from "./hooks/usePortfolioData";
import { useLenis } from "./hooks/useLenis";
import LoadingScreen from "./components/helper/LoadingScreen";
import ErrorScreen from "./components/helper/ErrorScreen";
import AppLayout from "./layout/AppLayout";


function App() {
  // Initialize smooth scrolling 
  useLenis();

  // Fetch centralized data layer
  const { data, loading, error } = usePortfolioData();
  const viewKey = loading ? "loading" : error || !data ? "error" : "content";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={viewKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        {loading ? (
          <LoadingScreen />
        ) : error || !data ? (
          <ErrorScreen />
        ) : (
          <AppLayout data={data} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default App;