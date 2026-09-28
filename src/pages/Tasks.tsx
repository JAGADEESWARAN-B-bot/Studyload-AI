import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  X,
  BookOpen
} from 'lucide-react';
import { TaskType, TaskPriority } from '../types';

export const Tasks: React.FC = () => {
  const { tasks, addTask, deleteTask, toggleTaskCompleted, subjects } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [type, setType] = useState<TaskType>('Assignment');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [estimatedHours, setEstimatedHours] = useState(2.0);

  const completedCount = tasks.filter(t => t.is_completed).length;
  const pendingCount = tasks.filter(t => !t.is_completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter(t => {
    if (statusFilter === 'Pending' && t.is_completed) return false;
    if (statusFilter === 'Completed' && !t.is_completed) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    if (typeFilter !== 'All' && t.type !== typeFilter) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedSubject = subjects.find(s => s.id === subjectId);
    const subName = matchedSubject ? matchedSubject.name : (subjects[0]?.name || 'General Studies');

    addTask({
      title: title.trim(),
      subject_id: subjectId,
      subject_name: subName,
      type,
      deadline: deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      priority,
      is_completed: false,
      estimated_hours: Number(estimatedHours)
    });

    setTitle('');
    setDeadline('');
    setShowAddModal(false);
  };

  const getDeadlineStatus = (dateStr: string, isCompleted: boolean) => {
    if (isCompleted) return { label: 'Completed', color: 'text-slate-400 bg-slate-100' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)}d`, color: 'text-rose-700 bg-rose-50 border-rose-200' };
    } else if (diffDays === 0) {
      return { label: 'Due Today', color: 'text-rose-700 bg-rose-100 border-rose-300 font-bold' };
    } else if (diffDays <= 3) {
      return { label: `Due in ${diffDays}d`, color: 'text-amber-700 bg-amber-50 border-amber-200' };
    } else {
      return { label: `Due in ${diffDays}d`, color: 'text-slate-600 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            Deliverables & Milestone Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assignments & Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track impending deadlines, estimate study requirements, and feed urgency penalties to the prediction engine.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          Add Deliverable
        </button>
      </div>

      {/* Metric summary banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Pipeline</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{tasks.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Pending</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Completed</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Completion Rate</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">{completionRate}%</div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5">
          {(['All', 'Pending', 'Completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === status 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs font-medium py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-medium py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Assignment">Assignment</option>
            <option value="Exam">Exam Prep</option>
            <option value="Chapter">Chapter</option>
            <option value="Revision">Revision</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-slate-500 text-sm space-y-3">
            <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
            <p>No tasks match your selected filters.</p>
          </div>
        ) : (
          filteredTasks.map(t => {
            const deadlineStatus = getDeadlineStatus(t.deadline, t.is_completed);

            return (
              <div
                key={t.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white shadow-xs ${
                  t.is_completed ? 'opacity-60 bg-slate-50/50 border-slate-200' : 'hover:border-indigo-200 border-slate-200'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTaskCompleted(t.id)}
                    className="mt-0.5 sm:mt-0 p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {t.is_completed ? (
                      <CheckSquare className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm font-bold truncate ${t.is_completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {t.title}
                      </h3>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        t.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' :
                        t.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                        t.priority === 'Medium' ? 'bg-sky-100 text-sky-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {t.priority}
                      </span>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {t.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span className="font-semibold text-indigo-600">{t.subject_name}</span>
                      <span>Est: <strong>{t.estimated_hours} hrs</strong></span>
                      <span>Target: <strong>{t.deadline}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${deadlineStatus.color}`}>
                    {deadlineStatus.label}
                  </span>

                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Add New Deliverable</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Deliverable Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Research Essay"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.difficulty})</option>
                  ))}
                  {subjects.length === 0 && <option value="">General Studies</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Deliverable Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TaskType)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Exam">Exam Prep</option>
                    <option value="Chapter">Chapter</option>
                    <option value="Revision">Revision</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Target Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Est. Hours (hrs)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="30"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  Save Deliverable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
