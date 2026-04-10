import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TestEngine from './pages/TestEngine';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* The Main Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Authentication Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* The Dynamic Test Engine */}
        <Route path="/test/:testId" element={<TestEngine />} />
      </Routes>
    </Router>
  );
}

export default App;