import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  Sliders, 
  Calendar, 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  BarChart3, 
  Play
} from 'lucide-react';
import { WorkloadGauge } from '../components/WorkloadGauge';

export const Home: React.FC = () => {
  const { prediction, loadDemoData } = useApp();

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/50 via-sky-200/40 to-indigo-100/30 blur-3xl -z-10 rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            AI-Assisted Study Workload Prediction System
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Predict your study workload.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600">
              Plan your time. Study smarter.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            Eliminate exam cramming and academic burnout. StudyLoad AI analyzes your course curriculum, pending chapters, deadlines, and study capacity to calculate a deterministic workload score and an actionable schedule.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={loadDemoData}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
            >
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              Load Interactive Demo
            </button>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 sm:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Live Prediction Preview</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Real-Time Academic Workload Engine</h2>
              <p className="text-sm text-slate-500 mt-1">Simulated output from active course data</p>
            </div>
            <Link
              to="/prediction"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Open What-If Simulator &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 items-center">
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 mb-2">Workload Stress Gauge</span>
              <WorkloadGauge score={prediction.workload_score || 68} level={prediction.workload_level || 'HIGH'} size={240} />
            </div>

            <div className="space-y-4 md:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block">Enrolled Courses</span>
                  <span className="text-xl font-extrabold text-slate-900">{prediction.total_subjects || 5} Subjects</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block">Required Time</span>
                  <span className="text-xl font-extrabold text-indigo-600">{prediction.required_weekly_hours || 24.5} h / wk</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-semibold text-slate-500 block">Target Daily Hours</span>
                  <span className="text-xl font-extrabold text-emerald-600">{prediction.recommended_daily_hours || 3.5} h / day</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Congestion Warning:</strong> Artificial Intelligence & Data Structures both have midterm exams within 12 days. The system automatically shifts 65% of study schedule blocks to these high-difficulty subjects.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Process</span>
          <h2 className="text-3xl font-extrabold text-slate-900">How StudyLoad AI Works</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            A three-step deterministic framework translating academic syllabi into realistic daily actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Input Academic Workload</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add your courses, pending chapter counts, subject difficulty (Easy, Medium, Hard, Very Hard), assignment deadlines, and your actual available hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-extrabold flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Deterministic Prediction</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our mathematical model calculates chapter backlogs, deadline urgency multipliers, exam proximity factors, and capacity stress into a normalized 0–100 score.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Actionable Schedule & AI</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive a balanced timetable matching your available study hours, run What-If simulations to test study changes, and get Gemini AI study coaching.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Core Capabilities</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Engineered for Academic Success</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Workload Classification</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standardized into LOW (0-24), MODERATE (25-49), HIGH (50-74), and VERY HIGH (75-100) with danger warning alerts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">What-If Study Simulator</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Interactively adjust daily study hours, completed chapters, and assignment progress to observe immediate score drops.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Automated Timetable</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Schedules realistic 45 to 90-minute blocks with 15-minute breaks. Never schedules more hours than your declared capacity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Dual-Tier AI Advice</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Powered by Google Gemini with an offline deterministic heuristic fallback ensuring zero crashes if the API is offline.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Take Control of Your Academic Schedule
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Stop guessing your workload. Let StudyLoad AI balance your course backlog and plan your study hours before exam stress strikes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold text-indigo-950 bg-sky-400 hover:bg-sky-300 transition-colors shadow-md"
            >
              Open Dashboard
            </Link>
            <Link
              to="/input"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            >
              Add Your Subjects
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
