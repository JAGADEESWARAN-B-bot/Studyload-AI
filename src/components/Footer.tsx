import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-sky-200" />
              </div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                StudyLoad AI
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Predictive academic workload forecasting and timetable optimization for higher education students.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Deterministic Engine
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link></li>
              <li><Link to="/input" className="hover:text-indigo-600 transition-colors">Workload Input</Link></li>
              <li><Link to="/prediction" className="hover:text-indigo-600 transition-colors">Prediction & What-If</Link></li>
              <li><Link to="/schedule" className="hover:text-indigo-600 transition-colors">Study Timetable</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/tasks" className="hover:text-indigo-600 transition-colors">Task Management</Link></li>
              <li><Link to="/subjects" className="hover:text-indigo-600 transition-colors">Course Curriculum</Link></li>
              <li><Link to="/history" className="hover:text-indigo-600 transition-colors">Prediction History</Link></li>
              <li><Link to="/about" className="hover:text-indigo-600 transition-colors">Mathematical Logic</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Deployment & Tech</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Built with React, TypeScript, Vite, Tailwind CSS, Recharts, and Google Gemini AI. Fully verified for Vercel SPA deployment.
            </p>
            <div className="text-[11px] text-slate-400">
              Vercel Rewrites: Active (/index.html)
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} StudyLoad AI System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered for Academic Excellence & Workload Balance
          </p>
        </div>
      </div>
    </footer>
  );
};
