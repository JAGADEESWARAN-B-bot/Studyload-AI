package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.engine.RecommendationEngine
import com.example.data.engine.ScheduleGenerator
import com.example.data.engine.SimulationResult
import com.example.data.engine.WorkloadCalculator
import com.example.data.local.AppDatabase
import com.example.data.model.FullPrediction
import com.example.data.model.PredictionRecord
import com.example.data.model.ScheduleSlot
import com.example.data.model.Subject
import com.example.data.model.SubjectDifficulty
import com.example.data.model.Task
import com.example.data.model.TaskPriority
import com.example.data.model.TaskType
import com.example.data.model.UserProfile
import com.example.data.model.WorkloadLevel
import com.example.data.repository.StudyRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class WhatIfState(
    val dailyHoursDelta: Float = 0f,
    val extraCompletedChapters: Int = 0,
    val clearedAssignments: Int = 0,
    val examPrepBonusPercent: Int = 0,
    val simulationResult: SimulationResult? = null
)

class StudyLoadViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: StudyRepository = StudyRepository(AppDatabase.getDatabase(application))

    val userProfile: StateFlow<UserProfile> = repository.userProfile
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            UserProfile()
        ).let { flow ->
            // Fallback to default if null
            MutableStateFlow(UserProfile()).apply {
                viewModelScope.launch {
                    repository.userProfile.collect { profile ->
                        value = profile ?: UserProfile()
                    }
                }
            }
        }

    val subjects: StateFlow<List<Subject>> = repository.subjects
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            emptyList()
        )

    val tasks: StateFlow<List<Task>> = repository.tasks
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            emptyList()
        )

    val predictionHistory: StateFlow<List<PredictionRecord>> = repository.predictionHistory
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            emptyList()
        )

    val studySchedule: StateFlow<List<ScheduleSlot>> = repository.studySchedule
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            emptyList()
        )

    // Current Workload Prediction, dynamically derived
    private val _currentPrediction = MutableStateFlow(
        WorkloadCalculator.calculateWorkload(emptyList(), emptyList(), 3.5f)
    )
    val currentPrediction: StateFlow<FullPrediction> = _currentPrediction.asStateFlow()

    // What-If Simulation State
    private val _whatIfState = MutableStateFlow(WhatIfState())
    val whatIfState: StateFlow<WhatIfState> = _whatIfState.asStateFlow()

    // AI Study Recommendations
    private val _aiRecommendation = MutableStateFlow("")
    val aiRecommendation: StateFlow<String> = _aiRecommendation.asStateFlow()

    private val _isLoadingAi = MutableStateFlow(false)
    val isLoadingAi: StateFlow<Boolean> = _isLoadingAi.asStateFlow()

    // Navigation and snackbar messages
    private val _statusMessage = MutableStateFlow<String?>(null)
    val statusMessage: StateFlow<String?> = _statusMessage.asStateFlow()

    init {
        // Automatically recompute prediction whenever subjects, tasks, or userProfile update
        viewModelScope.launch {
            combine(repository.subjects, repository.tasks, userProfile) { subs, tks, prof ->
                Triple(subs, tks, prof)
            }.collect { (subs, tks, prof) ->
                val dailyHours = prof.dailyAvailableHours
                val newPrediction = WorkloadCalculator.calculateWorkload(subs, tks, dailyHours)
                _currentPrediction.value = newPrediction
                recalculateWhatIf(newPrediction)
            }
        }
    }

    fun dismissStatusMessage() {
        _statusMessage.value = null
    }

    fun loadDemoData() {
        viewModelScope.launch {
            repository.loadDemoData()
            _statusMessage.value = "Demo data loaded successfully!"
            refreshAiRecommendation()
        }
    }

    fun clearAllData() {
        viewModelScope.launch {
            repository.clearAllData()
            _statusMessage.value = "All data cleared."
            _aiRecommendation.value = ""
        }
    }

    fun updateUserProfile(
        name: String,
        course: String,
        semester: String,
        dailyHours: Float,
        startTime: String
    ) {
        viewModelScope.launch {
            val updated = userProfile.value.copy(
                studentName = name,
                course = course,
                semester = semester,
                dailyAvailableHours = dailyHours,
                preferredStudyStartTime = startTime
            )
            repository.updateProfile(updated)
            _statusMessage.value = "Profile updated."
        }
    }

    fun addSubject(
        name: String,
        code: String,
        difficulty: SubjectDifficulty,
        totalChapters: Int,
        completedChapters: Int,
        examDate: String,
        examPrep: Int,
        notes: String
    ) {
        viewModelScope.launch {
            val colors = listOf(0xFF6366F1, 0xFF0284C7, 0xFFEC4899, 0xFF10B981, 0xFF8B5CF6, 0xFFF59E0B)
            val assignedColor = colors[(subjects.value.size) % colors.size]

            val newSubject = Subject(
                name = name.trim(),
                code = code.trim(),
                difficulty = difficulty,
                totalChapters = totalChapters.coerceAtLeast(1),
                completedChapters = completedChapters.coerceIn(0, totalChapters),
                examDate = examDate.trim(),
                examPrepPercentage = examPrep.coerceIn(0, 100),
                notes = notes.trim(),
                colorHex = assignedColor
            )
            repository.addSubject(newSubject)
            saveCurrentPredictionSnapshot()
            _statusMessage.value = "Subject '$name' added."
        }
    }

    fun updateSubject(subject: Subject) {
        viewModelScope.launch {
            repository.updateSubject(subject)
            _statusMessage.value = "Subject updated."
        }
    }

    fun deleteSubject(subject: Subject) {
        viewModelScope.launch {
            repository.deleteSubject(subject)
            _statusMessage.value = "Subject deleted."
        }
    }

    fun addTask(
        title: String,
        subjectName: String,
        type: TaskType,
        deadline: String,
        priority: TaskPriority,
        hours: Float,
        notes: String
    ) {
        viewModelScope.launch {
            val subjectId = subjects.value.firstOrNull { it.name.equals(subjectName, ignoreCase = true) }?.id ?: 0
            val newTask = Task(
                title = title.trim(),
                subjectName = subjectName.trim(),
                subjectId = subjectId,
                type = type,
                deadline = deadline.trim(),
                priority = priority,
                estimatedHours = hours.coerceAtLeast(0.5f),
                notes = notes.trim(),
                isCompleted = false
            )
            repository.addTask(newTask)
            _statusMessage.value = "Task '$title' added."
        }
    }

    fun updateTask(task: Task) {
        viewModelScope.launch {
            repository.updateTask(task)
            _statusMessage.value = "Task updated."
        }
    }

    fun deleteTask(task: Task) {
        viewModelScope.launch {
            repository.deleteTask(task)
            _statusMessage.value = "Task deleted."
        }
    }

    fun toggleTaskCompleted(task: Task) {
        viewModelScope.launch {
            repository.toggleTaskCompleted(task.id, !task.isCompleted)
        }
    }

    fun saveCurrentPredictionSnapshot() {
        viewModelScope.launch {
            val pred = _currentPrediction.value
            val prof = userProfile.value
            val record = PredictionRecord(
                userId = prof.id,
                timestamp = System.currentTimeMillis(),
                dateString = SimpleDateFormat("MMM d, yyyy - h:mm a", Locale.US).format(Date()),
                workloadScore = pred.workloadScore,
                workloadLevel = pred.workloadLevel,
                totalSubjects = pred.totalSubjects,
                pendingTasks = pred.pendingAssignments,
                availableHoursPerDay = pred.availableDailyHours,
                recommendedDailyHours = pred.recommendedDailyHours,
                recommendedWeeklyHours = pred.recommendedWeeklyHours,
                summaryNotes = "Snapshot: ${pred.workloadLevel.label} (${pred.workloadScore}/100)"
            )
            repository.savePrediction(record)
            _statusMessage.value = "Prediction saved to history."
        }
    }

    fun regenerateSchedule() {
        viewModelScope.launch {
            val subs = subjects.value
            val tks = tasks.value
            val prof = userProfile.value
            val newSlots = ScheduleGenerator.generateWeeklySchedule(
                subs,
                tks,
                prof.dailyAvailableHours,
                prof.preferredStudyStartTime
            )
            repository.saveSchedule(newSlots)
            _statusMessage.value = "Weekly study schedule generated!"
        }
    }

    fun updateWhatIfSliders(
        dailyHoursDelta: Float,
        extraCompletedChapters: Int,
        clearedAssignments: Int,
        examPrepBonusPercent: Int
    ) {
        val currPred = _currentPrediction.value
        val simulatedDailyHours = (currPred.availableDailyHours + dailyHoursDelta).coerceAtLeast(0.5f)
        val result = WorkloadCalculator.simulateWhatIf(
            currPred,
            simulatedDailyHours,
            extraCompletedChapters,
            clearedAssignments,
            examPrepBonusPercent
        )
        _whatIfState.value = WhatIfState(
            dailyHoursDelta = dailyHoursDelta,
            extraCompletedChapters = extraCompletedChapters,
            clearedAssignments = clearedAssignments,
            examPrepBonusPercent = examPrepBonusPercent,
            simulationResult = result
        )
    }

    private fun recalculateWhatIf(currentPred: FullPrediction) {
        val s = _whatIfState.value
        val simulatedDailyHours = (currentPred.availableDailyHours + s.dailyHoursDelta).coerceAtLeast(0.5f)
        val result = WorkloadCalculator.simulateWhatIf(
            currentPred,
            simulatedDailyHours,
            s.extraCompletedChapters,
            s.clearedAssignments,
            s.examPrepBonusPercent
        )
        _whatIfState.value = s.copy(simulationResult = result)
    }

    fun refreshAiRecommendation() {
        viewModelScope.launch {
            _isLoadingAi.value = true
            try {
                val recommendation = RecommendationEngine.getRecommendations(
                    _currentPrediction.value,
                    subjects.value,
                    tasks.value
                )
                _aiRecommendation.value = recommendation
            } catch (e: Exception) {
                _aiRecommendation.value = RecommendationEngine.generateLocalFallback(
                    _currentPrediction.value,
                    subjects.value,
                    tasks.value
                )
            } finally {
                _isLoadingAi.value = false
            }
        }
    }
}
