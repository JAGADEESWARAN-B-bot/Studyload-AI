import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WorkloadGauge } from '../components/WorkloadGauge';
import { 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  BookmarkCheck, 
  ArrowRight,
  BookOpen,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export const Prediction: React.FC = () => {
  const { 
    prediction, 
    whatIf, 
    updateWhatIfSliders, 
    savePredictionSnapshot, 
    aiRecommendation, 
    refreshAiRecommendation, 
    isLoadingAi 
  } = useApp();

  const [snapshotSaved, setSnapshotSaved] = useState(false);

  // What-If local slider states
  const [hoursDelta, setHoursDelta] = useState(0);
  const [extraChapters, setExtraChapters] = useState(0);
  const [clearedAssignments, setClearedAssignments] = useState(0);
  const [examBonus, setExamBonus] = useState(0);

  const handleSliderChange = (
    h = hoursDelta, 
    c = extraChapters, 
    a = clearedAssignments, 
    e = examBonus
  ) => {
    updateWhatIfSliders(h, c, a, e);
  };

  const handleSaveSnapshot = () => {
    savePredictionSnapshot();
    setSnapshotSaved(true);
    setTimeout(() => setSnapshotSaved(false), 3000);
  };

  const subjectChartData = prediction.subject_workloads.map(s => ({
    name: s.subject_name.length > 14 ? s.subject_name.substring(0, 12) + '...' : s.subject_name,
    fullName: s.subject_name,
    score: s.workload_score,
    hours: s.required_weekly_hours,
    difficulty: s.difficulty
  }));

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'VERY HIGH': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'HIGH': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'MODERATE': return 'text-sky-600 bg-sky-50 border-sky-200';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Predictive Workload Analysis
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Study Workload Diagnostic
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calculated via academic curriculum modeling, chapter congestion, and student capacity ratios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveSnapshot}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              snapshotSaved 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {snapshotSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <BookmarkCheck className="w-4 h-4 text-indigo-600" />}
            {snapshotSaved ? 'Snapshot Saved!' : 'Save to History'}
          </button>

          <Link
            to="/schedule"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
          >
            View Study Schedule
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Top Main Diagnostic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Gauge & Level Card */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Workload Index</span>
            <div className="flex items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getLevelColor(prediction.workload_level)}`}>
                {prediction.workload_level} WORKLOAD
              </span>
            </div>
          </div>

          {/* SVG Gauge */}
          <div className="py-2">
            <WorkloadGauge score={prediction.workload_score} level={prediction.workload_level} size={260} />
          </div>

          <div className="w-full grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-left">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Weekly Required</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {prediction.required_weekly_hours.toFixed(1)} <span className="text-xs font-normal text-slate-500">hrs</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Available Capacity</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {prediction.available_weekly_hours.toFixed(1)} <span className="text-xs font-normal text-slate-500">hrs</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Capacity utilization is at <strong>{prediction.capacity_utilization_percentage}%</strong>. 
            {prediction.capacity_utilization_percentage > 100 
              ? ' You are in study deficit! Workload exceeds planned study hours.' 
              : ' Your schedule is within manageable study limits.'}
          </p>
        </div>

        {/* Breakdown & Target Metrics */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">Recommended Daily</span>
              <div className="text-2xl font-black text-indigo-600">
                {prediction.recommended_daily_hours.toFixed(1)} <span className="text-xs font-medium text-slate-500">h/day</span>
              </div>
              <p className="text-[11px] text-slate-400">Paced pace to complete targets</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">Pending Chapters</span>
              <div className="text-2xl font-black text-slate-900">
                {prediction.total_pending_chapters}
              </div>
              <p className="text-[11px] text-slate-400">Across {prediction.total_subjects} enrolled subjects</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">Due Assignments</span>
              <div className="text-2xl font-black text-amber-600">
                {prediction.pending_assignments}
              </div>
              <p className="text-[11px] text-slate-400">Within the current pipeline</p>
            </div>
          </div>

          {/* Subject Workload Bar Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Subject Workload Comparison</h3>
              <span className="text-xs text-slate-500">Score per course (0-100)</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    formatter={(val: any) => [`${val} / 100`, 'Workload Score']}
                    labelFormatter={(label, items) => items[0]?.payload?.fullName || label}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {subjectChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.score > 75 ? '#e11d48' :
                          entry.score > 50 ? '#f59e0b' :
                          entry.score > 25 ? '#0284c7' : '#10b981'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Risk Factors & Bottlenecks
            </h3>
            
            {prediction.risk_factors.length === 0 ? (
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No critical academic risk factors detected! Keep up the balanced pace.
              </p>
            ) : (
              <div className="space-y-2">
                {prediction.risk_factors.map(rf => (
                  <div 
                    key={rf.id} 
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      rf.severity === 'critical' ? 'bg-rose-50/70 border-rose-200 text-rose-900' :
                      rf.severity === 'warning' ? 'bg-amber-50/70 border-amber-200 text-amber-900' :
                      'bg-sky-50/70 border-sky-200 text-sky-900'
                    }`}
                  >
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                      rf.severity === 'critical' ? 'text-rose-600' :
                      rf.severity === 'warning' ? 'text-amber-600' : 'text-sky-600'
                    }`} />
                    <div>
                      <strong className="font-bold">{rf.title}: </strong>
                      <span>{rf.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Interactive What-If Simulator */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-800/60 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-800/80 text-indigo-200 text-xs font-semibold">
              <Sliders className="w-3.5 h-3.5 text-indigo-300" />
              Interactive Workload Simulator
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              "What-If" Academic Scenario Planner
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/80">
              Adjust hypothetical inputs below to see how increasing study hours or clearing assignments affects your workload in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-indigo-900/60 p-3 rounded-2xl border border-indigo-700/50">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-indigo-300 block font-semibold">Simulated Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{whatIf.simulated_score}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  whatIf.score_delta < 0 ? 'bg-emerald-500/20 text-emerald-300' :
                  whatIf.score_delta > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-300'
                }`}>
                  {whatIf.score_delta > 0 ? `+${whatIf.score_delta}` : whatIf.score_delta} pts
                </span>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase border ${
              whatIf.simulated_level === 'VERY HIGH' ? 'border-rose-400 bg-rose-500/20 text-rose-300' :
              whatIf.simulated_level === 'HIGH' ? 'border-amber-400 bg-amber-500/20 text-amber-300' :
              whatIf.simulated_level === 'MODERATE' ? 'border-sky-400 bg-sky-500/20 text-sky-300' :
              'border-emerald-400 bg-emerald-500/20 text-emerald-300'
            }`}>
              {whatIf.simulated_level}
            </span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          
          {/* Slider 1 */}
          <div className="bg-indigo-900/40 p-4 rounded-xl border border-indigo-700/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-indigo-200">Daily Study Hours (+/-)</span>
              <span className="text-white font-bold">{hoursDelta > 0 ? `+${hoursDelta}h` : `${hoursDelta}h`}</span>
            </div>
            <input 
              type="range" 
              min="-2" 
              max="4" 
              step="0.5" 
              value={hoursDelta} 
              onChange={(e) => {
                const val = Number(e.target.value);
                setHoursDelta(val);
                handleSliderChange(val, extraChapters, clearedAssignments, examBonus);
              }}
              className="w-full h-2 bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
            <p className="text-[11px] text-indigo-300/70">Increases or decreases available daily study capacity.</p>
          </div>

          {/* Slider 2 */}
          <div className="bg-indigo-900/40 p-4 rounded-xl border border-indigo-700/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-indigo-200">Extra Chapters Completed</span>
              <span className="text-white font-bold">+{extraChapters}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              step="1" 
              value={extraChapters} 
              onChange={(e) => {
                const val = Number(e.target.value);
                setExtraChapters(val);
                handleSliderChange(hoursDelta, val, clearedAssignments, examBonus);
              }}
              className="w-full h-2 bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
            <p className="text-[11px] text-indigo-300/70">Simulates reading extra chapters ahead of time.</p>
          </div>

          {/* Slider 3 */}
          <div className="bg-indigo-900/40 p-4 rounded-xl border border-indigo-700/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-indigo-200">Assignments Cleared</span>
              <span className="text-white font-bold">{clearedAssignments} finished</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="6" 
              step="1" 
              value={clearedAssignments} 
              onChange={(e) => {
                const val = Number(e.target.value);
                setClearedAssignments(val);
                handleSliderChange(hoursDelta, extraChapters, val, examBonus);
              }}
              className="w-full h-2 bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
            <p className="text-[11px] text-indigo-300/70">Reduces impending assignment deadline pressure.</p>
          </div>

          {/* Slider 4 */}
          <div className="bg-indigo-900/40 p-4 rounded-xl border border-indigo-700/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-indigo-200">Exam Prep Boost</span>
              <span className="text-white font-bold">+{examBonus}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="40" 
              step="5" 
              value={examBonus} 
              onChange={(e) => {
                const val = Number(e.target.value);
                setExamBonus(val);
                handleSliderChange(hoursDelta, extraChapters, clearedAssignments, val);
              }}
              className="w-full h-2 bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
            <p className="text-[11px] text-indigo-300/70">Boosts revision preparedness to suppress exam panic.</p>
          </div>

        </div>
      </div>

      {/* AI Recommendation Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Pedagogical Advice & Strategy</h3>
              <p className="text-xs text-slate-500">Personalized study plan advice generated for your current workload profile</p>
            </div>
          </div>

          <button
            onClick={refreshAiRecommendation}
            disabled={isLoadingAi}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
            {isLoadingAi ? 'Analyzing...' : 'Refresh AI Advice'}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
          {aiRecommendation || (
            "Based on your current subjects and pending chapters, prioritize high-difficulty coursework during your peak alertness hours. Divide pending chapters into 25-minute Pomodoro intervals to prevent cognitive fatigue."
          )}
        </div>
      </div>

      {/* Subject-Wise Detailed Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Detailed Subject-Wise Diagnostic</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Pending Chapters</th>
                <th className="py-3 px-4">Pending Tasks</th>
                <th className="py-3 px-4">Exam Countdown</th>
                <th className="py-3 px-4">Required Hours</th>
                <th className="py-3 px-4 text-right">Workload Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prediction.subject_workloads.map(s => (
                <tr key={s.subject_id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{s.subject_name}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      s.difficulty === 'Very Hard' ? 'bg-rose-100 text-rose-700' :
                      s.difficulty === 'Hard' ? 'bg-amber-100 text-amber-700' :
                      s.difficulty === 'Medium' ? 'bg-sky-100 text-sky-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {s.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{s.pending_chapters} chapters</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{s.pending_tasks} tasks</td>
                  <td className="py-3.5 px-4">
                    {s.exam_days_remaining !== null ? (
                      <span className={`text-xs font-semibold ${s.exam_days_remaining < 7 ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                        {s.exam_days_remaining} days
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">None scheduled</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600">{s.required_weekly_hours.toFixed(1)} hrs/wk</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-extrabold text-slate-900">{s.workload_score}</span>
                    <span className="text-xs text-slate-400">/100</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
