import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { InputForm } from './pages/InputForm';
import { Prediction } from './pages/Prediction';
import { Schedule } from './pages/Schedule';
import { Tasks } from './pages/Tasks';
import { Subjects } from './pages/Subjects';
import { History } from './pages/History';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/input" element={<InputForm />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Fallback to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
