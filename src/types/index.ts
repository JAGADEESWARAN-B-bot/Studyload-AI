export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Very Hard';

export type WorkloadClassification = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';

export type TaskType = 'Assignment' | 'Exam' | 'Chapter' | 'Revision';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Subject {
  id: string;
  user_id?: string;
  name: string;
  code?: string;
  difficulty: DifficultyLevel;
  total_chapters: number;
  completed_chapters: number;
  exam_date?: string; // YYYY-MM-DD
  exam_prep_percentage: number; // 0-100
  pending_assignments_count?: number;
  assignment_deadline?: string; // YYYY-MM-DD
  notes?: string;
  color?: string;
  created_at?: string;
}

export interface Task {
  id: string;
  user_id?: string;
  subject_id?: string;
  subject_name: string;
  title: string;
  type: TaskType;
  deadline: string; // YYYY-MM-DD
  priority: TaskPriority;
  is_completed: boolean;
  estimated_hours: number;
  notes?: string;
  created_at?: string;
}

export interface RiskFactor {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface SubjectWorkloadMetric {
  subject_id: string;
  subject_name: string;
  difficulty: DifficultyLevel;
  workload_score: number;
  required_weekly_hours: number;
  pending_chapters: number;
  pending_tasks: number;
  exam_days_remaining: number | null;
}

export interface PredictionResult {
  workload_score: number; // 0 - 100
  workload_level: WorkloadClassification;
  total_subjects: number;
  total_pending_chapters: number;
  pending_assignments: number;
  upcoming_exams: number;
  available_daily_hours: number;
  available_weekly_hours: number;
  required_weekly_hours: number;
  capacity_utilization_percentage: number;
  recommended_daily_hours: number;
  recommended_weekly_hours: number;
  overall_progress_percentage: number;
  subject_workloads: SubjectWorkloadMetric[];
  risk_factors: RiskFactor[];
  ai_recommendation?: string;
}

export interface PredictionRecord {
  id: string;
  user_id?: string;
  created_at: string;
  date_label: string;
  workload_score: number;
  workload_level: WorkloadClassification;
  total_subjects: number;
  pending_tasks: number;
  available_hours_daily: number;
  recommended_daily_hours: number;
  recommended_weekly_hours: number;
  notes?: string;
}

export interface ScheduleSlot {
  id: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string; // e.g. "6:00 PM"
  end_time: string;   // e.g. "7:15 PM"
  duration_minutes: number;
  subject_name: string;
  topic_description: string;
  is_revision?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  student_name: string;
  course: string;
  semester: string;
  daily_available_hours: number;
  preferred_start_time: string; // "17:30"
}

export interface WhatIfSimulation {
  daily_hours_delta: number;
  extra_completed_chapters: number;
  cleared_assignments: number;
  exam_prep_bonus: number;
  simulated_score: number;
  simulated_level: WorkloadClassification;
  score_delta: number;
  simulated_required_hours: number;
  simulated_capacity_percentage: number;
}
