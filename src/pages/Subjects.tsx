import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Calendar, 
  Award, 
  CheckCircle2, 
  X, 
  ChevronRight,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { DifficultyLevel } from '../types';

export const Subjects: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject, tasks } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [totalChapters, setTotalChapters] = useState(10);
  const [completedChapters, setCompletedChapters] = useState(3);
  const [examDate, setExamDate] = useState('');
  const [examPrep, setExamPrep] = useState(30);

  const totalChaptersAll = subjects.reduce((acc, s) => acc + s.total_chapters, 0);
  const completedChaptersAll = subjects.reduce((acc, s) => acc + s.completed_chapters, 0);
  const avgProgress = totalChaptersAll > 0 ? Math.round((completedChaptersAll / totalChaptersAll) * 100) : 0;

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSubject({
      name: name.trim(),
      code: code.trim().toUpperCase() || undefined,
      difficulty,
      total_chapters: Number(totalChapters),
      completed_chapters: Number(completedChapters),
      exam_date: examDate || undefined,
      exam_prep_percentage: Number(examPrep)
    });

    setName('');
    setCode('');
    setExamDate('');
    setShowAddModal(false);
  };

  const handleIncrementChapters = (id: string, current: number, total: number) => {
    if (current < total) {
      updateSubject(id, { completed_chapters: current + 1 });
    }
  };

  const handleDecrementChapters = (id: string, current: number) => {
    if (current > 0) {
      updateSubject(id, { completed_chapters: current - 1 });
    }
  };

  const getDaysUntilExam = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Subject & Course Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain course chapters, syllabus progression, difficulty ratings, and upcoming final exam milestones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          Enroll Subject
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Courses</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{subjects.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Chapters</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalChaptersAll}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Completed Chapters</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completedChaptersAll}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Overall Syllabus Progress</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">{avgProgress}%</div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-slate-500 text-sm space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <p>No subjects registered yet. Add your current courses to start tracking.</p>
          </div>
        ) : (
          subjects.map(s => {
            const pendingChapters = Math.max(0, s.total_chapters - s.completed_chapters);
            const pct = Math.round((s.completed_chapters / s.total_chapters) * 100);
            const daysToExam = getDaysUntilExam(s.exam_date);
            const subjectTasks = tasks.filter(t => t.subject_id === s.id && !t.is_completed);

            return (
              <div 
                key={s.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all p-5 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3.5 h-3.5 rounded-full shrink-0" 
                        style={{ backgroundColor: s.color || '#6366f1' }}
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">{s.name}</h3>
                        {s.code && (
                          <span className="text-[11px] font-mono font-medium text-slate-500">
                            {s.code}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteSubject(s.id)}
                      className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                      title="Remove subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Difficulty & Exam tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      s.difficulty === 'Very Hard' ? 'bg-rose-100 text-rose-700' :
                      s.difficulty === 'Hard' ? 'bg-amber-100 text-amber-700' :
                      s.difficulty === 'Medium' ? 'bg-sky-100 text-sky-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {s.difficulty} Difficulty
                    </span>

                    {daysToExam !== null && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        daysToExam < 7 ? 'bg-rose-100 text-rose-700 animate-pulse' :
                        daysToExam < 15 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Exam in {daysToExam} days ({s.exam_date})
                      </span>
                    )}
                  </div>

                  {/* Chapter Progression Tracker */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>Chapters: <strong>{s.completed_chapters} / {s.total_chapters}</strong></span>
                      <span className="font-bold text-indigo-600">{pct}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: s.color || '#6366f1' }}
                      />
                    </div>
                  </div>

                  {/* Quick chapter increment controls */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-400">Pending: <strong className="text-slate-700">{pendingChapters}</strong></span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDecrementChapters(s.id, s.completed_chapters)}
                        disabled={s.completed_chapters <= 0}
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-30"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleIncrementChapters(s.id, s.completed_chapters, s.total_chapters)}
                        disabled={s.completed_chapters >= s.total_chapters}
                        className="w-6 h-6 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{subjectTasks.length} pending deliverables</span>
                  <span>Prep: <strong>{s.exam_prep_percentage}%</strong></span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Add Academic Course</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Operating Systems"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    placeholder="CS-401"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Easy">Easy (1.0x workload)</option>
                    <option value="Medium">Medium (1.3x workload)</option>
                    <option value="Hard">Hard (1.7x workload)</option>
                    <option value="Very Hard">Very Hard (2.2x workload)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Total Syllabus Chapters
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={totalChapters}
                    onChange={(e) => setTotalChapters(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Completed Chapters
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={totalChapters}
                    value={completedChapters}
                    onChange={(e) => setCompletedChapters(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Upcoming Final Exam (Optional)
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Exam Preparedness ({examPrep}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={examPrep}
                    onChange={(e) => setExamPrep(Number(e.target.value))}
                    className="w-full h-2 mt-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
