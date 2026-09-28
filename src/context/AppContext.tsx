import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Subject, 
  Task, 
  PredictionResult, 
  PredictionRecord, 
  ScheduleSlot, 
  UserProfile, 
  WhatIfSimulation 
} from '../types';
import { calculateWorkload, simulateWhatIf } from '../lib/calculator';
import { generateWeeklySchedule } from '../lib/scheduler';
import { fetchAIRecommendations, getLocalFallbackRecommendation } from '../lib/gemini';
import { localStore, supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_PROFILE, DEMO_SUBJECTS, DEMO_TASKS } from '../lib/demoData';

interface AppContextType {
  user: UserProfile | null;
  subjects: Subject[];
  tasks: Task[];
  prediction: PredictionResult;
  whatIf: WhatIfSimulation;
  predictionHistory: PredictionRecord[];
  schedule: ScheduleSlot[];
  aiRecommendation: string;
  isLoadingAi: boolean;
  login: (email: string, studentName?: string) => Promise<boolean>;
  register: (email: string, studentName: string, course: string, semester: string, dailyHours: number) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  updateWhatIfSliders: (hoursDelta: number, extraChapters: number, clearedAssignments: number, examBonus: number) => void;
  savePredictionSnapshot: () => void;
  regenerateSchedule: () => void;
  refreshAiRecommendation: () => Promise<void>;
  loadDemoData: () => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [user, setUser] = useState<UserProfile | null>(() => {
    return localStore.get<UserProfile | null>('user_profile', DEMO_PROFILE);
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    return localStore.get<Subject[]>('subjects', DEMO_SUBJECTS);
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    return localStore.get<Task[]>('tasks', DEMO_TASKS);
  });

  const [predictionHistory, setPredictionHistory] = useState<PredictionRecord[]>(() => {
    return localStore.get<PredictionRecord[]>('prediction_history', []);
  });

  const [schedule, setSchedule] = useState<ScheduleSlot[]>(() => {
    return localStore.get<ScheduleSlot[]>('schedule', []);
  });

  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Synchronously compute active prediction whenever subjects, tasks, or user changes
  const prediction = useMemo(() => {
    const dailyHours = user?.daily_available_hours || 3.5;
    return calculateWorkload(subjects, tasks, dailyHours);
  }, [subjects, tasks, user?.daily_available_hours]);

  // What-If state
  const [whatIfParams, setWhatIfParams] = useState({
    hoursDelta: 0,
    extraChapters: 0,
    clearedAssignments: 0,
    examBonus: 0
  });

  const whatIf = useMemo(() => {
    return simulateWhatIf(
      prediction,
      whatIfParams.hoursDelta,
      whatIfParams.extraChapters,
      whatIfParams.clearedAssignments,
      whatIfParams.examBonus
    );
  }, [prediction, whatIfParams]);

  // Save to persistent storage
  useEffect(() => {
    if (user) localStore.set('user_profile', user);
    else localStore.remove('user_profile');
  }, [user]);

  useEffect(() => {
    localStore.set('subjects', subjects);
  }, [subjects]);

  useEffect(() => {
    localStore.set('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    localStore.set('prediction_history', predictionHistory);
  }, [predictionHistory]);

  useEffect(() => {
    localStore.set('schedule', schedule);
  }, [schedule]);

  // Auto-generate initial schedule if missing and subjects exist
  useEffect(() => {
    if (schedule.length === 0 && subjects.length > 0) {
      const generated = generateWeeklySchedule(
        subjects,
        tasks,
        user?.daily_available_hours || 3.5,
        user?.preferred_start_time || '17:30'
      );
      setSchedule(generated);
    }
  }, [subjects.length]);

  const login = async (email: string, studentName?: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      student_name: studentName || email.split('@')[0],
      course: 'College Studies',
      semester: 'Current Term',
      daily_available_hours: 3.5,
      preferred_start_time: '17:30'
    };
    setUser(newUser);
    return true;
  };

  const register = async (
    email: string,
    studentName: string,
    course: string,
    semester: string,
    dailyHours: number
  ): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      student_name: studentName,
      course,
      semester,
      daily_available_hours: dailyHours,
      preferred_start_time: '17:30'
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (profileUpdate: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...profileUpdate });
  };

  const addSubject = (newSub: Omit<Subject, 'id'>) => {
    const colors = ['#6366f1', '#0284c7', '#ec4899', '#10b981', '#8b5cf6', '#f59e0b'];
    const assignedColor = colors[subjects.length % colors.length];
    const created: Subject = {
      ...newSub,
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      color: newSub.color || assignedColor,
      created_at: new Date().toISOString()
    };
    setSubjects(prev => [...prev, created]);
  };

  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    // Also remove associated tasks
    setTasks(prev => prev.filter(t => t.subject_id !== id));
  };

  const addTask = (newTask: Omit<Task, 'id'>) => {
    const created: Task = {
      ...newTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString()
    };
    setTasks(prev => [created, ...prev]);
  };

  const updateTask = (id: string, updated: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: !t.is_completed } : t));
  };

  const updateWhatIfSliders = (
    hoursDelta: number,
    extraChapters: number,
    clearedAssignments: number,
    examBonus: number
  ) => {
    setWhatIfParams({
      hoursDelta,
      extraChapters,
      clearedAssignments,
      examBonus
    });
  };

  const savePredictionSnapshot = () => {
    const record: PredictionRecord = {
      id: `pred-${Date.now()}`,
      created_at: new Date().toISOString(),
      date_label: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      workload_score: prediction.workload_score,
      workload_level: prediction.workload_level,
      total_subjects: prediction.total_subjects,
      pending_tasks: prediction.pending_assignments,
      available_hours_daily: prediction.available_daily_hours,
      recommended_daily_hours: prediction.recommended_daily_hours,
      recommended_weekly_hours: prediction.recommended_weekly_hours,
      notes: `${prediction.workload_level} workload (${prediction.workload_score}/100)`
    };
    setPredictionHistory(prev => [record, ...prev]);
  };

  const regenerateSchedule = () => {
    const generated = generateWeeklySchedule(
      subjects,
      tasks,
      user?.daily_available_hours || 3.5,
      user?.preferred_start_time || '17:30'
    );
    setSchedule(generated);
  };

  const refreshAiRecommendation = async () => {
    setIsLoadingAi(true);
    try {
      const rec = await fetchAIRecommendations(prediction, subjects, tasks);
      setAiRecommendation(rec);
    } catch {
      setAiRecommendation(getLocalFallbackRecommendation(prediction, subjects, tasks));
    } finally {
      setIsLoadingAi(false);
    }
  };

  const loadDemoData = () => {
    setUser(DEMO_PROFILE);
    setSubjects(DEMO_SUBJECTS);
    setTasks(DEMO_TASKS);
    const demoSchedule = generateWeeklySchedule(DEMO_SUBJECTS, DEMO_TASKS, DEMO_PROFILE.daily_available_hours, DEMO_PROFILE.preferred_start_time);
    setSchedule(demoSchedule);

    // Add initial historical snapshot
    const initialPred = calculateWorkload(DEMO_SUBJECTS, DEMO_TASKS, DEMO_PROFILE.daily_available_hours);
    const initialRecord: PredictionRecord = {
      id: `pred-demo`,
      created_at: new Date().toISOString(),
      date_label: 'Current Snapshot',
      workload_score: initialPred.workload_score,
      workload_level: initialPred.workload_level,
      total_subjects: DEMO_SUBJECTS.length,
      pending_tasks: DEMO_TASKS.filter(t => !t.is_completed).length,
      available_hours_daily: DEMO_PROFILE.daily_available_hours,
      recommended_daily_hours: initialPred.recommended_daily_hours,
      recommended_weekly_hours: initialPred.recommended_weekly_hours,
      notes: 'Initial Demo Dataset'
    };
    setPredictionHistory([initialRecord]);
    setAiRecommendation(getLocalFallbackRecommendation(initialPred, DEMO_SUBJECTS, DEMO_TASKS));
  };

  const clearAllData = () => {
    setSubjects([]);
    setTasks([]);
    setSchedule([]);
    setPredictionHistory([]);
    setAiRecommendation('');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        subjects,
        tasks,
        prediction,
        whatIf,
        predictionHistory,
        schedule,
        aiRecommendation,
        isLoadingAi,
        login,
        register,
        logout,
        updateProfile,
        addSubject,
        updateSubject,
        deleteSubject,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,
        updateWhatIfSliders,
        savePredictionSnapshot,
        regenerateSchedule,
        refreshAiRecommendation,
        loadDemoData,
        clearAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
