import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  RotateCcw, 
  BookOpen, 
  CheckCircle, 
  Sparkles, 
  BrainCircuit, 
  Timer, 
  Flame,
  ArrowRight
} from 'lucide-react';

const DAYS: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const Schedule: React.FC = () => {
  const { schedule, regenerateSchedule, subjects, user } = useApp();
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      regenerateSchedule();
      setIsRegenerating(false);
    }, 400);
  };

  const daySlots = schedule.filter(s => s.day_of_week === selectedDay);
  const totalDayMinutes = daySlots.reduce((acc, s) => acc + s.duration_minutes, 0);
  const totalDayHours = (totalDayMinutes / 60).toFixed(1);

  const getSubjectColor = (name: string) => {
    const found = subjects.find(s => s.name === name);
    return found?.color || '#6366f1';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            Adaptive Timetable
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Weekly Study Schedule
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Algorithmic study distribution balancing chapter backlogs, assignment urgency, and daily capacity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 text-indigo-600 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Recalculating...' : 'Regenerate Timetable'}
          </button>

          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
          >
            View Pending Tasks
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Day Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DAYS.map(day => {
          const count = schedule.filter(s => s.day_of_week === day).length;
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex flex-col items-center gap-1 border ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{day}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'
              }`}>
                {count} {count === 1 ? 'block' : 'blocks'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Schedule Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Timetable slots */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{selectedDay}'s Study Plan</h2>
              <p className="text-xs text-slate-500">
                Target: {totalDayHours} hours across {daySlots.length} sessions
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Start time: {user?.preferred_start_time || '17:30'}
            </div>
          </div>

          {daySlots.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-500 text-sm space-y-3">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <p>No study blocks scheduled for {selectedDay}. Rest day or light revision.</p>
              <button
                onClick={handleRegenerate}
                className="text-indigo-600 font-bold hover:underline text-xs"
              >
                Regenerate Schedule
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {daySlots.map((slot, index) => {
                const color = getSubjectColor(slot.subject_name);

                return (
                  <div
                    key={slot.id || index}
                    className="p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div 
                        className="w-2.5 self-stretch rounded-full shrink-0" 
                        style={{ backgroundColor: color }}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{slot.subject_name}</h3>
                          {slot.is_revision && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              Revision / Spaced Repetition
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {slot.topic_description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:self-center shrink-0 text-xs font-semibold">
                      <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                        {slot.start_time} - {slot.end_time}
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold">
                        {slot.duration_minutes} min
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Study Technique Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Evidence-Based Study Protocols
            </h3>

            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                <Timer className="w-3.5 h-3.5 text-indigo-600" />
                Pomodoro Interval
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Work for 25 minutes of unbroken focus followed by a 5-minute break. After 4 cycles, take an extended 20-minute rest.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <BrainCircuit className="w-3.5 h-3.5 text-amber-600" />
                Active Recall
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Never just re-read passively. Close the book and write down key concepts or solve practice questions from memory.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Interleaved Practice
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Switching between different subjects in one day produces higher long-term exam retention than single-subject blocking.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-3 shadow-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">Target Daily Capacity</h4>
            <div className="text-3xl font-black">{user?.daily_available_hours || 3.5} <span className="text-sm font-normal text-indigo-200">hours/day</span></div>
            <p className="text-[11px] text-slate-300">
              Need to adjust your available time? Update it in the input settings to re-balance the entire week.
            </p>
            <Link
              to="/input"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-lg transition-all"
            >
              Update Daily Hours
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
