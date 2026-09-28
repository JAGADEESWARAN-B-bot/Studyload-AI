import { 
  Subject, 
  Task, 
  PredictionResult, 
  WorkloadClassification, 
  RiskFactor, 
  SubjectWorkloadMetric, 
  WhatIfSimulation,
  DifficultyLevel 
} from '../types';

const DIFFICULTY_MULTIPLIERS: Record<DifficultyLevel, number> = {
  'Easy': 1.0,
  'Medium': 1.5,
  'Hard': 2.2,
  'Very Hard': 3.0,
};

export function getWorkloadLevel(score: number): WorkloadClassification {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  if (clamped <= 24) return 'LOW';
  if (clamped <= 49) return 'MODERATE';
  if (clamped <= 74) return 'HIGH';
  return 'VERY HIGH';
}

export function getDaysRemaining(dateString?: string): number | null {
  if (!dateString) return null;
  const target = new Date(dateString);
  if (isNaN(target.getTime())) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function calculateWorkload(
  subjects: Subject[],
  tasks: Task[],
  dailyAvailableHours: number
): PredictionResult {
  const safeDailyHours = Math.max(0.5, dailyAvailableHours || 3.5);
  const weeklyAvailableHours = safeDailyHours * 7;

  if (subjects.length === 0) {
    return {
      workload_score: 0,
      workload_level: 'LOW',
      total_subjects: 0,
      total_pending_chapters: 0,
      pending_assignments: 0,
      upcoming_exams: 0,
      available_daily_hours: safeDailyHours,
      available_weekly_hours: Number(weeklyAvailableHours.toFixed(1)),
      required_weekly_hours: 0,
      capacity_utilization_percentage: 0,
      recommended_daily_hours: safeDailyHours,
      recommended_weekly_hours: Number(weeklyAvailableHours.toFixed(1)),
      overall_progress_percentage: 0,
      subject_workloads: [],
      risk_factors: [
        {
          id: 'no-subjects',
          title: 'No Subjects Added',
          description: 'Add your courses and tasks to calculate your personalized study workload score.',
          severity: 'info'
        }
      ]
    };
  }

  let totalPendingChapters = 0;
  let totalAllChapters = 0;
  let totalCompletedChapters = 0;
  let imminentDeadlines = 0;
  let upcomingExamsCount = 0;
  let totalWeeklyRequiredHours = 0;

  const riskFactors: RiskFactor[] = [];
  const subjectWorkloads: SubjectWorkloadMetric[] = [];

  subjects.forEach(subject => {
    const pendingCh = Math.max(0, subject.total_chapters - subject.completed_chapters);
    totalPendingChapters += pendingCh;
    totalAllChapters += subject.total_chapters;
    totalCompletedChapters += subject.completed_chapters;

    const diffMultiplier = DIFFICULTY_MULTIPLIERS[subject.difficulty] || 1.5;

    // Weekly hours required to cover chapters over an active study phase (~4 weeks)
    const baseChapterHours = pendingCh * (2.0 * diffMultiplier);
    const weeklyChapterHours = baseChapterHours / 3.5;

    // Filter tasks for this subject
    const subjectTasks = tasks.filter(t => 
      t.subject_id === subject.id || 
      t.subject_name.toLowerCase() === subject.name.toLowerCase()
    );
    const pendingTasks = subjectTasks.filter(t => !t.is_completed);

    let assignmentWeeklyHours = 0;
    pendingTasks.forEach(task => {
      const days = getDaysRemaining(task.deadline);
      let urgencyMultiplier = 1.0;
      if (days !== null) {
        if (days <= 1) {
          imminentDeadlines++;
          urgencyMultiplier = 2.2;
          riskFactors.push({
            id: `urgent-task-${task.id}`,
            title: `Critical Deadline: ${task.title}`,
            description: `Due in ${days} day(s) for ${subject.name}. Requires urgent completion.`,
            severity: 'critical'
          });
        } else if (days <= 3) {
          imminentDeadlines++;
          urgencyMultiplier = 1.7;
          riskFactors.push({
            id: `warning-task-${task.id}`,
            title: `Approaching Deadline: ${task.title}`,
            description: `Due in ${days} days for ${subject.name}.`,
            severity: 'warning'
          });
        } else if (days <= 7) {
          urgencyMultiplier = 1.3;
        }
      }
      assignmentWeeklyHours += (task.estimated_hours * urgencyMultiplier) / 1.5;
    });

    // Exam Proximity Calculation
    const examDays = getDaysRemaining(subject.exam_date);
    let examPrepWeeklyHours = 0;
    if (examDays !== null) {
      upcomingExamsCount++;
      const unreadiness = Math.max(0, 100 - subject.exam_prep_percentage) / 100;
      if (examDays <= 4) {
        examPrepWeeklyHours = unreadiness * diffMultiplier * 7.5;
        riskFactors.push({
          id: `critical-exam-${subject.id}`,
          title: `Exam in ${examDays} Days: ${subject.name}`,
          description: `Readiness is only ${subject.exam_prep_percentage}% for a ${subject.difficulty} course. High risk of cramming.`,
          severity: 'critical'
        });
      } else if (examDays <= 8) {
        examPrepWeeklyHours = unreadiness * diffMultiplier * 5.0;
        riskFactors.push({
          id: `warning-exam-${subject.id}`,
          title: `Upcoming Exam: ${subject.name}`,
          description: `Exam is in ${examDays} days with ${subject.exam_prep_percentage}% readiness.`,
          severity: 'warning'
        });
      } else if (examDays <= 18) {
        examPrepWeeklyHours = unreadiness * diffMultiplier * 3.0;
      } else {
        examPrepWeeklyHours = unreadiness * diffMultiplier * 1.5;
      }
    }

    const subjectTotalHours = weeklyChapterHours + assignmentWeeklyHours + examPrepWeeklyHours;
    totalWeeklyRequiredHours += subjectTotalHours;

    // Subject Workload Score (normalized 10 - 100)
    const subScore = Math.min(100, Math.max(10, Math.round((subjectTotalHours / 8.0) * 60 + (pendingCh * 2.5))));

    subjectWorkloads.push({
      subject_id: subject.id,
      subject_name: subject.name,
      difficulty: subject.difficulty,
      workload_score: subScore,
      required_weekly_hours: Number(subjectTotalHours.toFixed(1)),
      pending_chapters: pendingCh,
      pending_tasks: pendingTasks.length,
      exam_days_remaining: examDays
    });

    if (pendingCh >= 6 && diffMultiplier >= 2.0) {
      riskFactors.push({
        id: `backlog-${subject.id}`,
        title: `Heavy Chapter Backlog: ${subject.name}`,
        description: `${pendingCh} chapters pending in a ${subject.difficulty} difficulty course.`,
        severity: 'warning'
      });
    }
  });

  // Capacity calculation
  const capacityRatio = totalWeeklyRequiredHours / weeklyAvailableHours;
  const capacityUtilization = Math.round(capacityRatio * 100);

  // Global deterministic workload score (0 - 100)
  const chaptersPendingRatio = totalAllChapters > 0 ? (totalPendingChapters / totalAllChapters) : 0.5;
  const rawScore = (capacityRatio * 44) + (imminentDeadlines * 7.5) + (chaptersPendingRatio * 20);
  const finalScore = Math.min(100, Math.max(5, Math.round(rawScore)));
  const workloadLevel = getWorkloadLevel(finalScore);

  // Capacity deficit warning
  if (totalWeeklyRequiredHours > weeklyAvailableHours) {
    const deficit = Number((totalWeeklyRequiredHours - weeklyAvailableHours).toFixed(1));
    riskFactors.unshift({
      id: 'capacity-deficit',
      title: 'Study Capacity Deficit Detected',
      description: `Required study hours (${totalWeeklyRequiredHours.toFixed(1)} hrs/wk) exceed your available limit (${weeklyAvailableHours.toFixed(1)} hrs/wk) by ${deficit} hours.`,
      severity: 'critical'
    });
  }

  // Recommended hours
  const recommendedWeekly = totalWeeklyRequiredHours > weeklyAvailableHours
    ? totalWeeklyRequiredHours * 1.05
    : Math.max(totalWeeklyRequiredHours, weeklyAvailableHours * 0.85);

  const recommendedDaily = Number((recommendedWeekly / 7).toFixed(1));

  const overallProgress = totalAllChapters > 0
    ? Math.min(100, Math.round((totalCompletedChapters / totalAllChapters) * 100))
    : 0;

  const pendingAssignmentsTotal = tasks.filter(t => !t.is_completed && t.type === 'Assignment').length;

  return {
    workload_score: finalScore,
    workload_level: workloadLevel,
    total_subjects: subjects.length,
    total_pending_chapters: totalPendingChapters,
    pending_assignments: pendingAssignmentsTotal,
    upcoming_exams: upcomingExamsCount,
    available_daily_hours: safeDailyHours,
    available_weekly_hours: Number(weeklyAvailableHours.toFixed(1)),
    required_weekly_hours: Number(totalWeeklyRequiredHours.toFixed(1)),
    capacity_utilization_percentage: capacityUtilization,
    recommended_daily_hours: recommendedDaily,
    recommended_weekly_hours: Number(recommendedWeekly.toFixed(1)),
    overall_progress_percentage: overallProgress,
    subject_workloads: subjectWorkloads.sort((a, b) => b.workload_score - a.workload_score),
    risk_factors: riskFactors
  };
}

export function simulateWhatIf(
  base: PredictionResult,
  dailyHoursDelta: number,
  extraChapters: number,
  clearedAssignments: number,
  examPrepBonus: number
): WhatIfSimulation {
  const simulatedDaily = Math.max(0.5, base.available_daily_hours + dailyHoursDelta);
  const simulatedWeeklyAvailable = simulatedDaily * 7;

  // Hourly savings from simulated efforts
  const chapterHoursSaved = extraChapters * 1.8;
  const assignmentHoursSaved = clearedAssignments * 1.5;
  const examHoursSaved = (examPrepBonus / 100) * (base.upcoming_exams * 2.5);

  const newRequiredWeekly = Math.max(1.0, base.required_weekly_hours - (chapterHoursSaved + assignmentHoursSaved + examHoursSaved));
  const newCapacityRatio = newRequiredWeekly / simulatedWeeklyAvailable;
  const simulatedCapacityPercent = Math.max(0, Math.round(newCapacityRatio * 100));

  const remainingAssignments = Math.max(0, base.pending_assignments - clearedAssignments);
  const newRawScore = (newCapacityRatio * 44) + (remainingAssignments * 3.0);
  const simulatedScore = Math.min(100, Math.max(5, Math.round(newRawScore)));
  const simulatedLevel = getWorkloadLevel(simulatedScore);
  const delta = simulatedScore - base.workload_score;

  return {
    daily_hours_delta: dailyHoursDelta,
    extra_completed_chapters: extraChapters,
    cleared_assignments: clearedAssignments,
    exam_prep_bonus: examPrepBonus,
    simulated_score: simulatedScore,
    simulated_level: simulatedLevel,
    score_delta: delta,
    simulated_required_hours: Number(newRequiredWeekly.toFixed(1)),
    simulated_capacity_percentage: simulatedCapacityPercent
  };
}
