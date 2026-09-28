import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Sliders, 
  ChevronRight, 
  Database,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { WorkloadGauge } from '../components/WorkloadGauge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { user, subjects, tasks, prediction, loadDemoData } = useApp();

  const pendingTasks = tasks.filter(t => !t.is_completed);
  const completedTasks = tasks.filter(t => t.is_completed);

  // If no subjects added yet
  if (subjects.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">No study data available yet.</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Get started by entering your current semester courses, pending chapters, and assignment deadlines, or load our pre-configured college demo dataset.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/input"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Study Plan
          </Link>
          <button
            onClick={loadDemoData}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
          >
            <Database className="w-4 h-4 text-indigo-600" />
            Load Demo Data
          </button>
        </div>
      </div>
    );
  }

  // Recharts Data
  const subjectChartData = prediction.subject_workloads.map(s => ({
    name: s.subject_name.length > 12 ? `${s.subject_name.substring(0, 10)}...` : s.subject_name,
    fullName: s.subject_name,
    workload: s.workload_score,
    hours: s.required_weekly_hours,
  }));

  const taskPieData = [
    { name: 'Completed', value: completedTasks.length, color: '#10b981' },
    { name: 'Pending', value: pendingTasks.length, color: '#f59e0b' },
  ];

  const weeklyCapacityData = [
    { name: 'Available Limit', hours: prediction.available_weekly_hours, fill: '#10b981' },
    { name: 'Required Workload', hours: prediction.required_weekly_hours, fill: prediction.required_weekly_hours > prediction.available_weekly_hours ? '#ef4444' : '#6366f1' },
    { name: 'Recommended Pace', hours: prediction.recommended_weekly_hours, fill: '#0284c7' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{user?.student_name || 'Alex'}</span> &bull; {user?.course || 'Computer Science'} &bull; {user?.semester || 'Semester 5'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/input"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Course / Task
          </Link>
          <Link
            to="/prediction"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" /> What-If Simulator
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Subjects</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{prediction.total_subjects}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>{prediction.total_pending_chapters} pending chapters</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{pendingTasks.length}</div>
          <div className="text-[11px] text-slate-500">
            {prediction.pending_assignments} assignments pending
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Upcoming Exams</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{prediction.upcoming_exams}</div>
          <div className="text-[11px] text-slate-500">
            Scheduled in next 30 days
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available Study Time</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{prediction.available_daily_hours}h <span className="text-xs font-normal text-slate-400">/ day</span></div>
          <div className="text-[11px] text-slate-500">
            {prediction.available_weekly_hours}h weekly capacity limit
          </div>
        </div>
      </div>

      {/* Main Workload Gauge & Hours Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Workload Gauge */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Current Workload Stress</h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Capacity: {prediction.capacity_utilization_percentage}%
              </span>
            </div>
            <WorkloadGauge score={prediction.workload_score} level={prediction.workload_level} size={250} />
          </div>

          <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500">Curriculum Progress</div>
              <div className="text-base font-extrabold text-slate-800">{prediction.overall_progress_percentage}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500">Target Daily Pace</div>
              <div className="text-base font-extrabold text-indigo-600">{prediction.recommended_daily_hours}h / day</div>
            </div>
          </div>
        </div>

        {/* Weekly Workload Comparison Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Workload Capacity vs. Demand</h3>
              <p className="text-xs text-slate-500">Comparing required study hours against student availability</p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              Target: {prediction.recommended_weekly_hours}h / week
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCapacityData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" unit="h" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip formatter={(value: number) => [`${value} Hours`, 'Hours / Week']} />
                <Bar dataKey="hours" radius={[0, 8, 8, 0]}>
                  {weeklyCapacityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {prediction.required_weekly_hours > prediction.available_weekly_hours && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Deficit: You need {(prediction.required_weekly_hours - prediction.available_weekly_hours).toFixed(1)} more hours this week than your current schedule allows!
              </span>
              <Link to="/prediction" className="font-bold underline ml-2">Simulate Fix</Link>
            </div>
          )}
        </div>
      </div>

      {/* 2 Detailed Recharts: Subject Workload & Task Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Subject-Wise Workload Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Subject-Wise Workload Distribution</h3>
              <p className="text-xs text-slate-500">Calculated pressure score (0-100) per enrolled course</p>
            </div>
            <Link to="/subjects" className="text-xs font-semibold text-indigo-600 hover:underline">
              Manage Subjects &rarr;
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: number) => [`${value} pts`, 'Workload Score']} />
                <Bar dataKey="workload" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Completion Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Task Completion Rate</h3>
              <p className="text-xs text-slate-500">Assignment & exam milestones</p>
            </div>
            <Link to="/tasks" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            {tasks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {taskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-400">No tasks created</span>
            )}
          </div>

          <div className="pt-2 text-center text-xs text-slate-500">
            {completedTasks.length} completed &bull; {pendingTasks.length} pending
          </div>
        </div>

      </div>

      {/* Critical Risk Factors & Actionable Warnings */}
      {prediction.risk_factors.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Identified Workload Risk Factors ({prediction.risk_factors.length})
            </h3>
            <Link to="/prediction" className="text-xs font-semibold text-indigo-600 hover:underline">
              Simulate Solutions &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prediction.risk_factors.slice(0, 4).map(risk => {
              const bg = risk.severity === 'critical' ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-amber-50 border-amber-200 text-amber-900';
              return (
                <div key={risk.id} className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${bg}`}>
                  <div className="font-bold flex items-center justify-between">
                    <span>{risk.title}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/70">
                      {risk.severity}
                    </span>
                  </div>
                  <div className="text-slate-700">{risk.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
