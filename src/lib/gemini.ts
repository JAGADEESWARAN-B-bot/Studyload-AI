import { PredictionResult, Subject, Task } from '../types';

export function getLocalFallbackRecommendation(
  prediction: PredictionResult,
  subjects: Subject[],
  tasks: Task[]
): string {
  if (subjects.length === 0) {
    return "Welcome to StudyLoad AI! Add your enrolled academic subjects, pending chapters, and assignment deadlines to generate personalized study recommendations.";
  }

  const topSubject = prediction.subject_workloads[0]?.subject_name || subjects[0]?.name || 'Core Subject';
  const urgentTask = tasks.find(t => !t.is_completed);

  const priorityAction = urgentTask 
    ? `Immediately focus on '${urgentTask.title}' for ${urgentTask.subject_name} (Deadline: ${urgentTask.deadline || 'Pending'}).`
    : `Begin with ${topSubject} to clear chapter backlogs in your highest-pressure course.`;

  const paceAdvice = {
    'LOW': `Your current academic workload is manageable. Maintain a steady pace of ${prediction.recommended_daily_hours} hours/day to steadily advance through chapters before exam season.`,
    'MODERATE': `Your workload is in a healthy range, but demands consistency. Dedicate 60% of your daily ${prediction.recommended_daily_hours} hours to ${topSubject} and the remainder to secondary coursework.`,
    'HIGH': `High workload alert! Protect at least ${prediction.recommended_daily_hours} hours daily for focused study. Postpone non-essential activities and target critical assignment deadlines first.`,
    'VERY HIGH': `CRITICAL CAPACITY STRESS: Required hours exceed your available time. Prioritize high-weight exam topics and imminent assignments immediately. Use 25-minute Pomodoro sprints to prevent mental fatigue.`
  }[prediction.workload_level];

  return `🎯 Priority Action Today:
${priorityAction}

📚 Course Attention Allocation:
Allocate your primary energy to ${topSubject} (${prediction.subject_workloads[0]?.difficulty || 'High'} difficulty). Spread your remaining hours across secondary courses.

⏱️ Suggested Daily Routine:
Aim for ${prediction.recommended_daily_hours} hours/day broken into two focused blocks (e.g. 5:30 PM – 7:00 PM and 7:30 PM – 9:00 PM).

💡 Strategic Study Technique:
${paceAdvice} Combine Active Recall (self-testing without looking at notes) with the 50/10 Pomodoro cadence for maximum retention.`;
}

export async function fetchAIRecommendations(
  prediction: PredictionResult,
  subjects: Subject[],
  tasks: Task[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.includes('YOUR_')) {
    return getLocalFallbackRecommendation(prediction, subjects, tasks);
  }

  try {
    const subjectSummary = subjects.map(s => 
      `${s.name} (${s.difficulty}, ${s.total_chapters - s.completed_chapters} chapters left, Exam: ${s.exam_date || 'None'})`
    ).join('; ');

    const taskSummary = tasks.filter(t => !t.is_completed).slice(0, 5).map(t => 
      `${t.title} (${t.subject_name}, Due: ${t.deadline})`
    ).join('; ');

    const prompt = `You are StudyLoad AI, an expert academic workload counselor.
Analyze this college student's study situation:
- Workload Score: ${prediction.workload_score}/100 (${prediction.workload_level})
- Available Study Hours: ${prediction.available_daily_hours} hrs/day (${prediction.available_weekly_hours} hrs/week)
- Required Study Hours: ${prediction.required_weekly_hours} hrs/week (Capacity Stress: ${prediction.capacity_utilization_percentage}%)
- Enrolled Courses: ${subjectSummary}
- Urgent Pending Tasks: ${taskSummary || 'None'}

Provide concise, practical, highly actionable study guidance with these 4 sections:
1. 🎯 Priority Action: Exactly what to study first today.
2. 📚 Subject Focus: Which subject requires immediate attention and why.
3. ⏱️ Suggested Daily Plan: How to split study sessions.
4. 💡 Study Technique Tip: One proven technique (e.g. Active Recall, Feynman, Pomodoro) tailored to their workload.
Keep your response supportive and structured with clean bullet points.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 500,
          }
        })
      }
    );

    if (!response.ok) {
      console.warn('Gemini API call returned non-200, falling back to local engine');
      return getLocalFallbackRecommendation(prediction, subjects, tasks);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (candidateText && typeof candidateText === 'string' && candidateText.trim().length > 0) {
      return candidateText.trim();
    }
  } catch (error) {
    console.error('Failed to query Gemini API, using local fallback:', error);
  }

  return getLocalFallbackRecommendation(prediction, subjects, tasks);
}
