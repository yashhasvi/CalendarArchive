import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toaster';
import Header from './components/Header';
import Calendar from './components/Calendar';
import DateDetailView from './components/DateDetailView';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import Settings from './components/Settings';
import FloatingAI from './components/FloatingAI';
import { Toaster } from './components/ui/Toaster';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-earth-50 to-stone-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Calendar />} />
                  <Route path="/date/:date" element={<DateDetailView />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
              <FloatingAI />
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
