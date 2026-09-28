import { Subject, Task, ScheduleSlot } from '../types';

const DAYS: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'> = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute < 10 ? `0${minute}` : `${minute}`;
  return `${displayHour}:${displayMinute} ${period}`;
}

export function generateWeeklySchedule(
  subjects: Subject[],
  tasks: Task[],
  dailyAvailableHours: number,
  preferredStartTime: string = '17:30'
): ScheduleSlot[] {
  if (subjects.length === 0) return [];

  const slots: ScheduleSlot[] = [];

  // Sort subjects by priority: highest difficulty and most pending chapters first
  const sortedSubjects = [...subjects].sort((a, b) => {
    const diffWeights = { 'Very Hard': 4, 'Hard': 3, 'Medium': 2, 'Easy': 1 };
    const weightDiff = (diffWeights[b.difficulty] || 2) - (diffWeights[a.difficulty] || 2);
    if (weightDiff !== 0) return weightDiff;
    return (b.total_chapters - b.completed_chapters) - (a.total_chapters - a.completed_chapters);
  });

  // Parse start time (default 17:30 / 5:30 PM)
  let [startHour, startMin] = [17, 30];
  try {
    const parts = preferredStartTime.split(':');
    if (parts.length >= 2) {
      startHour = parseInt(parts[0], 10);
      startMin = parseInt(parts[1], 10);
    }
  } catch {
    // default
  }

  // Calculate session count based on available hours
  const safeHours = Math.max(0.5, dailyAvailableHours || 3.5);
  const sessionCount = safeHours <= 1.5 ? 1 : safeHours <= 3.0 ? 2 : safeHours <= 4.5 ? 3 : 4;
  const sessionDurationMinutes = Math.min(90, Math.max(45, Math.floor((safeHours * 60) / sessionCount)));

  let subjectPointer = 0;

  DAYS.forEach(day => {
    let currentHour = startHour;
    let currentMin = startMin;

    for (let session = 0; session < sessionCount; session++) {
      const subject = sortedSubjects[subjectPointer % sortedSubjects.length];
      subjectPointer++;

      const startTimeStr = formatTime(currentHour, currentMin);

      // Add session minutes
      let endTotalMinutes = (currentHour * 60) + currentMin + sessionDurationMinutes;
      const endHour = Math.floor(endTotalMinutes / 60) % 24;
      const endMin = endTotalMinutes % 60;
      const endTimeStr = formatTime(endHour, endMin);

      // Determine task or topic
      const activeTask = tasks.find(t => 
        !t.is_completed && 
        (t.subject_id === subject.id || t.subject_name.toLowerCase() === subject.name.toLowerCase())
      );

      let topic = '';
      if (activeTask) {
        topic = `Work on: ${activeTask.title}`;
      } else if (subject.total_chapters > subject.completed_chapters) {
        topic = `Chapter ${subject.completed_chapters + 1} Deep Reading & Notes`;
      } else if (subject.exam_date) {
        topic = `Mock Exam Prep & High-Yield Practice Problems`;
      } else {
        topic = `Revision & Concept Flashcards`;
      }

      const isRevision = day === 'Saturday' || day === 'Sunday' || session === sessionCount - 1;

      slots.push({
        id: `slot-${day}-${session}-${subject.id}`,
        day_of_week: day,
        start_time: startTimeStr,
        end_time: endTimeStr,
        duration_minutes: sessionDurationMinutes,
        subject_name: subject.name,
        topic_description: topic,
        is_revision: isRevision
      });

      // Add 15-minute break
      const breakTotal = (endHour * 60) + endMin + 15;
      currentHour = Math.floor(breakTotal / 60) % 24;
      currentMin = breakTotal % 60;
    }
  });

  return slots;
}
