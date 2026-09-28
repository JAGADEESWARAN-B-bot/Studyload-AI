import { Subject, Task, UserProfile } from '../types';

function getRelativeDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export const DEMO_PROFILE: UserProfile = {
  id: 'demo-user-1',
  email: 'alex.rivera@university.edu',
  student_name: 'Alex Rivera',
  course: 'B.S. Computer Science',
  semester: 'Semester 5',
  daily_available_hours: 3.5,
  preferred_start_time: '17:30'
};

export const DEMO_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    name: 'Artificial Intelligence',
    code: 'CS-501',
    difficulty: 'Hard',
    total_chapters: 12,
    completed_chapters: 4,
    exam_date: getRelativeDate(7),
    exam_prep_percentage: 35,
    pending_assignments_count: 1,
    assignment_deadline: getRelativeDate(3),
    notes: 'Focus on A* search, Minimax with alpha-beta pruning, and neural network backpropagation.',
    color: '#6366f1'
  },
  {
    id: 'sub-2',
    name: 'Database Management',
    code: 'CS-502',
    difficulty: 'Medium',
    total_chapters: 10,
    completed_chapters: 6,
    exam_date: getRelativeDate(18),
    exam_prep_percentage: 60,
    pending_assignments_count: 1,
    assignment_deadline: getRelativeDate(4),
    notes: 'B+ Tree indexing, SQL normalization (3NF/BCNF), and ACID concurrency control.',
    color: '#0284c7'
  },
  {
    id: 'sub-3',
    name: 'Data Structures',
    code: 'CS-503',
    difficulty: 'Hard',
    total_chapters: 14,
    completed_chapters: 5,
    exam_date: getRelativeDate(12),
    exam_prep_percentage: 40,
    pending_assignments_count: 2,
    assignment_deadline: getRelativeDate(2),
    notes: 'Graph algorithms (Dijkstra, Prim), AVL tree balancing, and dynamic programming.',
    color: '#ec4899'
  },
  {
    id: 'sub-4',
    name: 'Computer Networks',
    code: 'CS-504',
    difficulty: 'Medium',
    total_chapters: 9,
    completed_chapters: 5,
    exam_date: getRelativeDate(22),
    exam_prep_percentage: 55,
    pending_assignments_count: 1,
    assignment_deadline: getRelativeDate(8),
    notes: 'TCP/IP 3-way handshake, CIDR subnetting, and congestion window scaling.',
    color: '#10b981'
  },
  {
    id: 'sub-5',
    name: 'Software Engineering',
    code: 'CS-505',
    difficulty: 'Easy',
    total_chapters: 8,
    completed_chapters: 6,
    exam_date: getRelativeDate(28),
    exam_prep_percentage: 75,
    pending_assignments_count: 1,
    assignment_deadline: getRelativeDate(10),
    notes: 'Agile Scrum sprints, UML sequence diagrams, and CI/CD pipelines.',
    color: '#8b5cf6'
  }
];

export const DEMO_TASKS: Task[] = [
  {
    id: 'task-1',
    subject_id: 'sub-3',
    subject_name: 'Data Structures',
    title: 'Graph Traversal & Shortest Path Implementation',
    type: 'Assignment',
    deadline: getRelativeDate(2),
    priority: 'Urgent',
    is_completed: false,
    estimated_hours: 3.5,
    notes: 'Implement Dijkstra and Bellman-Ford in Java or C++.'
  },
  {
    id: 'task-2',
    subject_id: 'sub-1',
    subject_name: 'Artificial Intelligence',
    title: 'Adversarial Search & Minimax Game Agent',
    type: 'Assignment',
    deadline: getRelativeDate(3),
    priority: 'High',
    is_completed: false,
    estimated_hours: 3.0,
    notes: 'Implement Alpha-Beta pruning with depth-limited heuristic board evaluations.'
  },
  {
    id: 'task-3',
    subject_id: 'sub-2',
    subject_name: 'Database Management',
    title: 'SQL Complex Joins & Subqueries Lab Report',
    type: 'Assignment',
    deadline: getRelativeDate(4),
    priority: 'Medium',
    is_completed: false,
    estimated_hours: 2.0,
    notes: 'Explain query plans and optimization indices.'
  },
  {
    id: 'task-4',
    subject_id: 'sub-1',
    subject_name: 'Artificial Intelligence',
    title: 'AI Midterm Examination',
    type: 'Exam',
    deadline: getRelativeDate(7),
    priority: 'Urgent',
    is_completed: false,
    estimated_hours: 6.0,
    notes: 'Chapters 1-6, Search heuristics, and Logic proofs.'
  },
  {
    id: 'task-5',
    subject_id: 'sub-3',
    subject_name: 'Data Structures',
    title: 'Data Structures Midterm Examination',
    type: 'Exam',
    deadline: getRelativeDate(12),
    priority: 'High',
    is_completed: false,
    estimated_hours: 5.0,
    notes: 'Trees, Heaps, and Dynamic Programming memorization.'
  },
  {
    id: 'task-6',
    subject_id: 'sub-4',
    subject_name: 'Computer Networks',
    title: 'Wireshark Packet Analysis Lab',
    type: 'Assignment',
    deadline: getRelativeDate(8),
    priority: 'Low',
    is_completed: false,
    estimated_hours: 1.5,
    notes: 'Capture HTTP vs HTTPS TLS handshakes.'
  },
  {
    id: 'task-7',
    subject_id: 'sub-5',
    subject_name: 'Software Engineering',
    title: 'Sprint Retrospective & Burndown Documentation',
    type: 'Assignment',
    deadline: getRelativeDate(1),
    priority: 'Medium',
    is_completed: true,
    estimated_hours: 2.0,
    notes: 'Completed sprint review slides.'
  }
];
