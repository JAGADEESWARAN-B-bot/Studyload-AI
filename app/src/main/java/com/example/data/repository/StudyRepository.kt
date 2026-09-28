package com.example.data.repository

import com.example.data.engine.ScheduleGenerator
import com.example.data.engine.WorkloadCalculator
import com.example.data.local.AppDatabase
import com.example.data.model.DayOfWeekEnum
import com.example.data.model.PredictionRecord
import com.example.data.model.ScheduleSlot
import com.example.data.model.Subject
import com.example.data.model.SubjectDifficulty
import com.example.data.model.Task
import com.example.data.model.TaskPriority
import com.example.data.model.TaskType
import com.example.data.model.UserProfile
import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

class StudyRepository(private val database: AppDatabase) {

    private val userProfileDao = database.userProfileDao()
    private val subjectDao = database.subjectDao()
    private val taskDao = database.taskDao()
    private val predictionDao = database.predictionDao()
    private val scheduleDao = database.scheduleDao()

    val userProfile: Flow<UserProfile?> = userProfileDao.getUserProfile()
    val subjects: Flow<List<Subject>> = subjectDao.getSubjects()
    val tasks: Flow<List<Task>> = taskDao.getTasks()
    val predictionHistory: Flow<List<PredictionRecord>> = predictionDao.getPredictionHistory()
    val latestPredictionRecord: Flow<PredictionRecord?> = predictionDao.getLatestPrediction()
    val studySchedule: Flow<List<ScheduleSlot>> = scheduleDao.getSchedule()

    suspend fun updateProfile(profile: UserProfile) {
        userProfileDao.insertOrUpdateProfile(profile)
    }

    suspend fun addSubject(subject: Subject): Long {
        return subjectDao.insertSubject(subject)
    }

    suspend fun updateSubject(subject: Subject) {
        subjectDao.updateSubject(subject)
    }

    suspend fun deleteSubject(subject: Subject) {
        subjectDao.deleteSubject(subject)
    }

    suspend fun addTask(task: Task): Long {
        return taskDao.insertTask(task)
    }

    suspend fun updateTask(task: Task) {
        taskDao.updateTask(task)
    }

    suspend fun deleteTask(task: Task) {
        taskDao.deleteTask(task)
    }

    suspend fun toggleTaskCompleted(taskId: Long, isCompleted: Boolean) {
        taskDao.setTaskCompleted(taskId, isCompleted)
    }

    suspend fun savePrediction(record: PredictionRecord): Long {
        return predictionDao.insertPrediction(record)
    }

    suspend fun saveSchedule(slots: List<ScheduleSlot>) {
        scheduleDao.clearSchedule()
        scheduleDao.insertSchedule(slots)
    }

    /**
     * Seeds realistic Demo Data as requested:
     * - Artificial Intelligence
     * - Database Management
     * - Data Structures
     * - Computer Networks
     * - Software Engineering
     */
    suspend fun loadDemoData() {
        val cal = Calendar.getInstance()
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)

        // Clean existing
        subjectDao.deleteAllSubjects()
        taskDao.deleteAllTasks()
        predictionDao.deleteAllPredictions()
        scheduleDao.clearSchedule()

        // Create default user profile
        val profile = UserProfile(
            id = "default_user",
            studentName = "Alex Rivera",
            course = "B.S. Computer Science",
            semester = "Semester 5",
            dailyAvailableHours = 3.5f,
            preferredStudyStartTime = "17:30",
            email = "alex.rivera@university.edu"
        )
        userProfileDao.insertOrUpdateProfile(profile)

        // Helper dates
        fun getRelativeDate(daysAhead: Int): String {
            val c = Calendar.getInstance()
            c.add(Calendar.DAY_OF_YEAR, daysAhead)
            return sdf.format(c.time)
        }

        val demoSubjects = listOf(
            Subject(
                name = "Artificial Intelligence",
                code = "CS-501",
                difficulty = SubjectDifficulty.HARD,
                totalChapters = 12,
                completedChapters = 4,
                examDate = getRelativeDate(7),
                examPrepPercentage = 35,
                pendingAssignmentsCount = 1,
                assignmentDeadline = getRelativeDate(3),
                notes = "Focus on A* search, Minimax, and Neural Net backprop.",
                colorHex = 0xFF6366F1
            ),
            Subject(
                name = "Database Management",
                code = "CS-502",
                difficulty = SubjectDifficulty.MEDIUM,
                totalChapters = 10,
                completedChapters = 6,
                examDate = getRelativeDate(18),
                examPrepPercentage = 60,
                pendingAssignmentsCount = 1,
                assignmentDeadline = getRelativeDate(4),
                notes = "B+ Trees, SQL normalization (3NF/BCNF), and ACID properties.",
                colorHex = 0xFF0284C7
            ),
            Subject(
                name = "Data Structures",
                code = "CS-503",
                difficulty = SubjectDifficulty.HARD,
                totalChapters = 14,
                completedChapters = 5,
                examDate = getRelativeDate(12),
                examPrepPercentage = 40,
                pendingAssignmentsCount = 2,
                assignmentDeadline = getRelativeDate(2),
                notes = "Graph traversal (Dijkstra), AVL balancing, and dynamic programming.",
                colorHex = 0xFFEC4899
            ),
            Subject(
                name = "Computer Networks",
                code = "CS-504",
                difficulty = SubjectDifficulty.MEDIUM,
                totalChapters = 9,
                completedChapters = 5,
                examDate = getRelativeDate(22),
                examPrepPercentage = 55,
                pendingAssignmentsCount = 1,
                assignmentDeadline = getRelativeDate(8),
                notes = "TCP/IP 3-way handshake, Subnetting, and Congestion control.",
                colorHex = 0xFF10B981
            ),
            Subject(
                name = "Software Engineering",
                code = "CS-505",
                difficulty = SubjectDifficulty.EASY,
                totalChapters = 8,
                completedChapters = 6,
                examDate = getRelativeDate(28),
                examPrepPercentage = 75,
                pendingAssignmentsCount = 1,
                assignmentDeadline = getRelativeDate(10),
                notes = "Agile Scrum sprints, UML design patterns, CI/CD pipeline.",
                colorHex = 0xFF8B5CF6
            )
        )

        subjectDao.insertSubjects(demoSubjects)

        val demoTasks = listOf(
            Task(
                title = "Data Structures Assignment: Graph Algorithms",
                subjectName = "Data Structures",
                type = TaskType.ASSIGNMENT,
                deadline = getRelativeDate(2),
                priority = TaskPriority.URGENT,
                isCompleted = false,
                estimatedHours = 3.5f,
                notes = "Implement Dijkstra and Prim's algorithm in Java/Kotlin."
            ),
            Task(
                title = "AI Minimax Alpha-Beta Pruning Implementation",
                subjectName = "Artificial Intelligence",
                type = TaskType.ASSIGNMENT,
                deadline = getRelativeDate(3),
                priority = TaskPriority.HIGH,
                isCompleted = false,
                estimatedHours = 3.0f,
                notes = "Game-playing agent with depth-limited evaluation."
            ),
            Task(
                title = "DBMS SQL Lab 4: Complex Joins & Subqueries",
                subjectName = "Database Management",
                type = TaskType.ASSIGNMENT,
                deadline = getRelativeDate(4),
                priority = TaskPriority.MEDIUM,
                isCompleted = false,
                estimatedHours = 2.0f,
                notes = "Write indexed nested queries and explain plans."
            ),
            Task(
                title = "AI Midterm Exam Preparation",
                subjectName = "Artificial Intelligence",
                type = TaskType.EXAM,
                deadline = getRelativeDate(7),
                priority = TaskPriority.URGENT,
                isCompleted = false,
                estimatedHours = 6.0f,
                notes = "Review chapters 1 through 6, Heuristic evaluation equations."
            ),
            Task(
                title = "Data Structures Midterm Exam",
                subjectName = "Data Structures",
                type = TaskType.EXAM,
                deadline = getRelativeDate(12),
                priority = TaskPriority.HIGH,
                isCompleted = false,
                estimatedHours = 5.0f,
                notes = "Trees, Heaps, and Dynamic Programming memorization."
            ),
            Task(
                title = "Computer Networks Wireshark Packet Analysis",
                subjectName = "Computer Networks",
                type = TaskType.ASSIGNMENT,
                deadline = getRelativeDate(8),
                priority = TaskPriority.LOW,
                isCompleted = false,
                estimatedHours = 1.5f,
                notes = "Capture HTTP vs HTTPS TLS handshake packets."
            ),
            Task(
                title = "Software Engineering Architecture Sprint Review",
                subjectName = "Software Engineering",
                type = TaskType.ASSIGNMENT,
                deadline = getRelativeDate(1),
                priority = TaskPriority.MEDIUM,
                isCompleted = true,
                estimatedHours = 2.0f,
                notes = "Sprint retrospective document and burndown chart."
            )
        )

        taskDao.insertTasks(demoTasks)

        // Calculate and save initial prediction
        val prediction = WorkloadCalculator.calculateWorkload(demoSubjects, demoTasks, profile.dailyAvailableHours)
        val record = PredictionRecord(
            userId = profile.id,
            timestamp = System.currentTimeMillis(),
            dateString = SimpleDateFormat("MMM d, yyyy", Locale.US).format(Date()),
            workloadScore = prediction.workloadScore,
            workloadLevel = prediction.workloadLevel,
            totalSubjects = demoSubjects.size,
            pendingTasks = demoTasks.count { !it.isCompleted },
            availableHoursPerDay = profile.dailyAvailableHours,
            recommendedDailyHours = prediction.recommendedDailyHours,
            recommendedWeeklyHours = prediction.recommendedWeeklyHours,
            summaryNotes = "Demo dataset initialized with 5 technical CS courses."
        )
        predictionDao.insertPrediction(record)

        // Generate and save schedule
        val schedule = ScheduleGenerator.generateWeeklySchedule(
            demoSubjects,
            demoTasks,
            profile.dailyAvailableHours,
            profile.preferredStudyStartTime
        )
        scheduleDao.insertSchedule(schedule)
    }

    suspend fun clearAllData() {
        subjectDao.deleteAllSubjects()
        taskDao.deleteAllTasks()
        predictionDao.deleteAllPredictions()
        scheduleDao.clearSchedule()
    }
}
