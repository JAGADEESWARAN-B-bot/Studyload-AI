import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Sliders, 
  BrainCircuit,
  HelpCircle
} from 'lucide-react';
import { DifficultyLevel, TaskType, TaskPriority } from '../types';

export const InputForm: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    updateProfile, 
    subjects, 
    addSubject, 
    deleteSubject, 
    tasks, 
    addTask,
    savePredictionSnapshot
  } = useApp();

  // Daily hours form state
  const [dailyHours, setDailyHours] = useState<number>(user?.daily_available_hours || 3.5);
  const [studentName, setStudentName] = useState<string>(user?.student_name || '');
  const [courseName, setCourseName] = useState<string>(user?.course || '');
  const [semester, setSemester] = useState<string>(user?.semester || '');

  // Quick subject form
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subDifficulty, setSubDifficulty] = useState<DifficultyLevel>('Medium');
  const [totalChapters, setTotalChapters] = useState(8);
  const [completedChapters, setCompletedChapters] = useState(2);
  const [examDate, setExamDate] = useState('');
  const [examPrep, setExamPrep] = useState(25);

  // Quick task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubjectId, setTaskSubjectId] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('Assignment');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium');
  const [taskHours, setTaskHours] = useState(2.5);

  const [activeTab, setActiveTab] = useState<'profile' | 'subjects' | 'tasks'>('subjects');
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      student_name: studentName,
      course: courseName,
      semester,
      daily_available_hours: Number(dailyHours)
    });
    setSuccessMessage('Student parameters updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;

    addSubject({
      name: subName.trim(),
      code: subCode.trim().toUpperCase() || undefined,
      difficulty: subDifficulty,
      total_chapters: Number(totalChapters),
      completed_chapters: Number(completedChapters),
      exam_date: examDate || undefined,
      exam_prep_percentage: Number(examPrep)
    });

    setSubName('');
    setSubCode('');
    setExamDate('');
    setSuccessMessage(`Subject "${subName}" added!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const matchedSubject = subjects.find(s => s.id === taskSubjectId);
    const subName = matchedSubject ? matchedSubject.name : (subjects[0]?.name || 'General Coursework');

    addTask({
      title: taskTitle.trim(),
      subject_id: taskSubjectId || subjects[0]?.id,
      subject_name: subName,
      type: taskType,
      deadline: taskDeadline || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      priority: taskPriority,
      is_completed: false,
      estimated_hours: Number(taskHours)
    });

    setTaskTitle('');
    setTaskDeadline('');
    setSuccessMessage(`Task "${taskTitle}" queued!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleComputeAndNavigate = () => {
    savePredictionSnapshot();
    navigate('/prediction');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            Study Load Intake Form
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Parameters & Intake
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Feed your current courses, pending chapters, deadlines, and study capacity into the predictive engine.
          </p>
        </div>

        <button
          onClick={handleComputeAndNavigate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all self-start md:self-center"
        >
          Compute Prediction
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'subjects'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          1. Subjects & Chapters ({subjects.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'tasks'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          2. Assignments & Deadlines ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          3. Study Capacity & Student Info
        </button>
      </div>

      {/* Tab 1: Subjects */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Subject Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Add Academic Subject</h2>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures & Algorithms"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    placeholder="CS-204"
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={subDifficulty}
                    onChange={(e) => setSubDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="Easy">Easy (1.0x)</option>
                    <option value="Medium">Medium (1.3x)</option>
                    <option value="Hard">Hard (1.7x)</option>
                    <option value="Very Hard">Very Hard (2.2x)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Total Chapters
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={totalChapters}
                    onChange={(e) => setTotalChapters(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Exam Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Prep Level ({examPrep}%)
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

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Subject to Analysis
              </button>
            </form>
          </div>

          {/* List of current subjects */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Enrolled Subjects ({subjects.length})
            </h3>

            {subjects.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-slate-500 text-sm">
                No subjects added yet. Add your first subject on the left or click "Load Interactive Demo" on the home page.
              </div>
            ) : (
              subjects.map(s => {
                const pending = Math.max(0, s.total_chapters - s.completed_chapters);
                const pct = Math.round((s.completed_chapters / s.total_chapters) * 100);

                return (
                  <div 
                    key={s.id} 
                    className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:border-indigo-200 transition-all"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full shrink-0" 
                          style={{ backgroundColor: s.color || '#6366f1' }}
                        />
                        <h4 className="text-sm font-bold text-slate-900 truncate">{s.name}</h4>
                        {s.code && (
                          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {s.code}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          s.difficulty === 'Very Hard' ? 'bg-rose-100 text-rose-700' :
                          s.difficulty === 'Hard' ? 'bg-amber-100 text-amber-700' :
                          s.difficulty === 'Medium' ? 'bg-sky-100 text-sky-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {s.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Chapters: <strong>{s.completed_chapters}/{s.total_chapters}</strong> ({pct}%)</span>
                        <span>Pending: <strong className="text-indigo-600">{pending}</strong></span>
                        {s.exam_date && (
                          <span>Exam: <strong className="text-amber-600">{s.exam_date}</strong></span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: s.color || '#6366f1' }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => deleteSubject(s.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Tasks */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Task Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Add Assignment or Exam Task</h2>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Report 3 or Term Paper"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Associated Subject
                </label>
                <select
                  value={taskSubjectId}
                  onChange={(e) => setTaskSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.difficulty})</option>
                  ))}
                  {subjects.length === 0 && <option value="">No subjects yet (add one first)</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Task Type
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as TaskType)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Exam">Exam Prep</option>
                    <option value="Chapter">Chapter Reading</option>
                    <option value="Revision">Revision</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
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
                    Deadline Date
                  </label>
                  <input
                    type="date"
                    required
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
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
                    max="20"
                    value={taskHours}
                    onChange={(e) => setTaskHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Task to Schedule
              </button>
            </form>
          </div>

          {/* List of Tasks */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Registered Tasks & Deadlines ({tasks.length})
            </h3>

            {tasks.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-slate-500 text-sm">
                No tasks added yet. Add pending assignments or exams on the left.
              </div>
            ) : (
              tasks.map(t => (
                <div 
                  key={t.id} 
                  className={`p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4 transition-all ${
                    t.is_completed ? 'opacity-50 bg-slate-50' : 'hover:border-indigo-200'
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold truncate ${t.is_completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {t.title}
                      </h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        t.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' :
                        t.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {t.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="text-indigo-600 font-medium">{t.subject_name}</span>
                      <span>Type: {t.type}</span>
                      <span>Due: <strong className="text-slate-800">{t.deadline}</strong></span>
                      <span>Est: <strong>{t.estimated_hours}h</strong></span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Student Capacity Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Study Capacity & Constraints</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Degree / Major
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. B.S. Computer Science"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Academic Term / Semester
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="e.g. Fall 2026 - Semester 5"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Available Daily Self-Study Hours
                </label>
                <span className="text-base font-extrabold text-indigo-700">
                  {dailyHours} hours/day
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full h-2.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-xs text-slate-500">
                Weekly capacity available: <strong>{(dailyHours * 7).toFixed(1)} hours/week</strong>. The prediction model will benchmark your required coursework against this quota.
              </p>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
            >
              Save Profile Settings
            </button>
          </form>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-base font-bold">Ready to analyze your study workload?</h3>
          <p className="text-xs text-slate-300">
            Our multi-variable deterministic algorithm calculates your workload score (0-100), urgency penalty, and generates an optimized weekly study plan.
          </p>
        </div>
        <button
          onClick={handleComputeAndNavigate}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-indigo-950 bg-white hover:bg-indigo-50 shadow-md transition-all"
        >
          View Workload Prediction
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
