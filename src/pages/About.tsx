import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  Sparkles, 
  Calculator, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Cpu,
  Zap
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Hero Intro */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <BrainCircuit className="w-3.5 h-3.5" />
          Academic Workload Architecture
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          About StudyLoad AI
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Intelligent Study Workload Prediction System engineered for college students to anticipate academic bottleneck periods, optimize revision schedules, and eliminate exam cramming.
        </p>
      </div>

      {/* Primary Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Deterministic Engine</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            The foundation of StudyLoad AI is mathematical and reproducible. Even without internet connectivity or AI API limits, the workload algorithm calculates accurate scores.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Gemini AI Pedagogical Layer</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Personalized advice, cognitive load balancing, and active recall suggestions are synthesized dynamically via Google Gemini models.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Interleaved Timetable</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Generates day-by-day study slots alternating high-difficulty theory with practical problem solving to maximize memory consolidation.
          </p>
        </div>
      </div>

      {/* The Mathematical Model Explained */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Explainable Algorithm</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            How the Workload Index is Calculated
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Unlike black-box models, StudyLoad AI breaks down every point of the 0–100 Workload Index into transparent components:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
              Chapter Backlog Load
            </div>
            <p className="leading-relaxed">
              Calculates pending chapters for each subject, multiplied by difficulty weight coefficients (Easy: 1.0x, Medium: 1.3x, Hard: 1.7x, Very Hard: 2.2x) and standard chapter absorption hours.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
              Assignment Urgency Multiplier
            </div>
            <p className="leading-relaxed">
              Assignments due within 3 days receive a 1.8x urgency multiplier; assignments due within 7 days receive a 1.3x multiplier. Overdue assignments introduce heavy stress penalties.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">3</span>
              Exam Proximity & Readiness Gap
            </div>
            <p className="leading-relaxed">
              If an exam is within 14 days, the readiness gap <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">(100 - ExamPrep%)</code> scales exponentially, signaling impending revision overload.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">4</span>
              Capacity Utilization Ratio
            </div>
            <p className="leading-relaxed">
              Compares <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">Required Weekly Hours</code> against <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">Available Weekly Hours</code>. Any ratio above 100% pushes the index into HIGH or VERY HIGH burnout territory.
            </p>
          </div>
        </div>

        {/* Classification Breakdown */}
        <div className="border-t border-slate-100 pt-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Classification Scale</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-sm font-extrabold text-emerald-700">0 – 35</div>
              <div className="text-xs font-bold text-emerald-800">LOW</div>
              <div className="text-[10px] text-emerald-600 mt-1">Comfortable pacing</div>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
              <div className="text-sm font-extrabold text-sky-700">36 – 60</div>
              <div className="text-xs font-bold text-sky-800">MODERATE</div>
              <div className="text-[10px] text-sky-600 mt-1">Balanced semester pace</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-sm font-extrabold text-amber-700">61 – 80</div>
              <div className="text-xs font-bold text-amber-800">HIGH</div>
              <div className="text-[10px] text-amber-600 mt-1">Tight deadlines / cram risk</div>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <div className="text-sm font-extrabold text-rose-700">81 – 100</div>
              <div className="text-xs font-bold text-rose-800">VERY HIGH</div>
              <div className="text-[10px] text-rose-600 mt-1">Academic overload deficit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Architecture */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-indigo-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            Stack & Deployment
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Engineered for Reliability</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400">Frontend Core</span>
            <div className="text-white font-bold text-sm">React 18 + Vite</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400">Type System</span>
            <div className="text-white font-bold text-sm">TypeScript</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400">Styling & UI</span>
            <div className="text-white font-bold text-sm">Tailwind CSS</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400">Data Visualization</span>
            <div className="text-white font-bold text-sm">Recharts</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400">Storage / Backend</span>
            <div className="text-white font-bold text-sm">Supabase + LocalStore</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400">AI Intelligence</span>
            <div className="text-white font-bold text-sm">Gemini AI + Fallback</div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">Start predicting your study workload right now:</span>
          <Link
            to="/input"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-950 bg-white hover:bg-slate-100 transition-all"
          >
            Open Input Form
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
};
