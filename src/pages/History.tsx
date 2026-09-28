import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  History as HistoryIcon, 
  Trash2, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

export const History: React.FC = () => {
  const { predictionHistory, savePredictionSnapshot, loadDemoData } = useApp();

  const chartData = [...predictionHistory].reverse().map((item, idx) => ({
    name: item.date_label || `Snapshot ${idx + 1}`,
    score: item.workload_score,
    level: item.workload_level,
    hours: item.recommended_daily_hours
  }));

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'VERY HIGH': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'HIGH': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'MODERATE': return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <HistoryIcon className="w-3.5 h-3.5" />
            Audit Trail & Progression
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Prediction Log & Workload History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review workload trends across the semester to identify exam cram spikes and study habit changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={savePredictionSnapshot}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition-all"
          >
            <BookmarkCheck className="w-4 h-4 text-indigo-600" />
            Log Current Snapshot
          </button>
        </div>
      </div>

      {predictionHistory.length === 0 ? (
        <div className="p-16 text-center bg-white border border-dashed border-slate-200 rounded-3xl space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No prediction snapshots saved yet</h3>
          <p className="text-xs text-slate-500">
            Whenever you adjust your curriculum or want to bookmark your workload diagnostic, click "Save to History" on the prediction screen.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/prediction"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
            >
              Go to Prediction
            </Link>
            <button
              onClick={loadDemoData}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Load Demo History
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Trend Chart */}
          {chartData.length > 1 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Semester Workload Progression</h3>
                  <p className="text-xs text-slate-500">Historical workload scores (0-100)</p>
                </div>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      formatter={(val: any) => [`${val} / 100`, 'Workload Score']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#4f46e5" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#4f46e5' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* History Records Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Recorded Diagnostics ({predictionHistory.length})</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Date / Time</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Workload Level</th>
                    <th className="py-3 px-4">Subjects</th>
                    <th className="py-3 px-4">Pending Tasks</th>
                    <th className="py-3 px-4">Available Capacity</th>
                    <th className="py-3 px-4">Recommended Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {predictionHistory.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {rec.date_label || new Date(rec.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {rec.workload_score} <span className="text-xs font-normal text-slate-400">/100</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getLevelBadge(rec.workload_level)}`}>
                          {rec.workload_level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{rec.total_subjects} courses</td>
                      <td className="py-3.5 px-4 text-slate-600">{rec.pending_tasks} items</td>
                      <td className="py-3.5 px-4 text-slate-600">{rec.available_hours_daily} hrs/day</td>
                      <td className="py-3.5 px-4 font-bold text-indigo-600">{rec.recommended_daily_hours.toFixed(1)} hrs/day</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
