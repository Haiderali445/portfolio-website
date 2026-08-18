// src/App.jsx
import React from "react";
import { usePortfolioData } from "./hooks/usePortfolioData";
import { useLenis } from "./hooks/useLenis";
import LoadingScreen from "./components/helper/LoadingScreen";
import ErrorScreen from "./components/helper/ErrorScreen";
import AppLayout from "./components/layout/AppLayout";


function App() {
  // Initialize smooth scrolling 
  useLenis();

  // Fetch centralized data layer
  const { data, loading, error } = usePortfolioData();

  if (loading) return <LoadingScreen />;
  if (error || !data) return <ErrorScreen />;

  return <AppLayout data={data} />;
}

export default App;