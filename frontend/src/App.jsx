import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TestEngine from './pages/TestEngine';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const isTestEngine = location.pathname.startsWith('/test/');
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isTestEngine && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isTestEngine && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            {/* The Main Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Authentication Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* User Progress Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* The Dynamic Test Engine */}
            <Route path="/test/:testId" element={<TestEngine />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;