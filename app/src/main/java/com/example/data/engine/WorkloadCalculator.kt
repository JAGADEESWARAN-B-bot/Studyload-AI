package com.example.data.engine

import com.example.data.model.FullPrediction
import com.example.data.model.RiskFactor
import com.example.data.model.RiskSeverity
import com.example.data.model.Subject
import com.example.data.model.SubjectWorkload
import com.example.data.model.Task
import com.example.data.model.WorkloadLevel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit
import kotlin.math.roundToInt

object WorkloadCalculator {

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)

    fun calculateWorkload(
        subjects: List<Subject>,
        tasks: List<Task>,
        dailyAvailableHours: Float
    ): FullPrediction {
        if (subjects.isEmpty()) {
            return FullPrediction(
                workloadScore = 0,
                workloadLevel = WorkloadLevel.LOW,
                totalSubjects = 0,
                totalPendingChapters = 0,
                pendingAssignments = 0,
                upcomingExamsCount = 0,
                availableDailyHours = dailyAvailableHours,
                availableWeeklyHours = dailyAvailableHours * 7,
                requiredWeeklyHours = 0f,
                capacityUtilizationPercent = 0,
                recommendedDailyHours = dailyAvailableHours,
                recommendedWeeklyHours = dailyAvailableHours * 7,
                overallProgressPercent = 0,
                subjectWorkloads = emptyList(),
                riskFactors = listOf(
                    RiskFactor(
                        title = "No Subjects Added",
                        description = "Add your academic courses to calculate your true workload score.",
                        severity = RiskSeverity.INFO
                    )
                ),
                aiRecommendation = "Add your enrolled subjects and upcoming deadlines to receive AI study predictions and optimization recommendations."
            )
        }

        val now = System.currentTimeMillis()
        var totalWeeklyRequiredHours = 0f
        var totalPendingChapters = 0
        var totalAllChapters = 0
        var totalCompletedChapters = 0
        var imminentDeadlinesCount = 0
        var upcomingExamsCount = 0
        val riskFactors = mutableListOf<RiskFactor>()
        val subjectWorkloads = mutableListOf<SubjectWorkload>()

        // 1. Calculate per-subject loads
        for (subject in subjects) {
            val pendingCh = subject.pendingChapters
            totalPendingChapters += pendingCh
            totalAllChapters += subject.totalChapters
            totalCompletedChapters += subject.completedChapters

            // Chapter study hours per week (spread over ~4 weeks semester sprint)
            val baseHoursPerChapter = 2.0f * subject.difficulty.multiplier
            val weeklyChapterHours = (pendingCh * baseHoursPerChapter) / 3.5f

            // Subject tasks
            val subjectTasks = tasks.filter { it.subjectId == subject.id || it.subjectName.equals(subject.name, ignoreCase = true) }
            val pendingTasks = subjectTasks.filter { !it.isCompleted }

            var assignmentHours = 0f
            for (task in pendingTasks) {
                val daysLeft = getDaysRemaining(task.deadline, now)
                val urgencyFactor = when {
                    daysLeft == null -> 1.0f
                    daysLeft <= 1 -> {
                        imminentDeadlinesCount++
                        2.2f
                    }
                    daysLeft <= 3 -> {
                        imminentDeadlinesCount++
                        1.7f
                    }
                    daysLeft <= 7 -> 1.3f
                    else -> 1.0f
                }
                assignmentHours += (task.estimatedHours * urgencyFactor) / 1.5f

                if (daysLeft != null && daysLeft <= 2) {
                    riskFactors.add(
                        RiskFactor(
                            title = "Urgent: ${task.title}",
                            description = "Due in $daysLeft day(s) for ${subject.name}. Requires high priority attention.",
                            severity = RiskSeverity.CRITICAL
                        )
                    )
                }
            }

            // Exam proximity
            val examDays = getDaysRemaining(subject.examDate, now)
            var examPrepWeeklyHours = 0f
            if (examDays != null && examDays >= 0) {
                upcomingExamsCount++
                val unreadiness = (100 - subject.examPrepPercentage).coerceAtLeast(0) / 100f
                examPrepWeeklyHours = when {
                    examDays <= 4 -> {
                        riskFactors.add(
                            RiskFactor(
                                title = "Exam in $examDays days: ${subject.name}",
                                description = "Only ${subject.examPrepPercentage}% prepped for ${subject.difficulty.label} difficulty.",
                                severity = RiskSeverity.CRITICAL
                            )
                        )
                        unreadiness * subject.difficulty.multiplier * 7.5f
                    }
                    examDays <= 8 -> {
                        riskFactors.add(
                            RiskFactor(
                                title = "Upcoming Exam: ${subject.name}",
                                description = "Exam is in $examDays days. Current readiness: ${subject.examPrepPercentage}%.",
                                severity = RiskSeverity.WARNING
                            )
                        )
                        unreadiness * subject.difficulty.multiplier * 5.0f
                    }
                    examDays <= 18 -> unreadiness * subject.difficulty.multiplier * 3.0f
                    else -> unreadiness * subject.difficulty.multiplier * 1.5f
                }
            }

            // Subject total weekly hours
            val subjectTotalHours = weeklyChapterHours + assignmentHours + examPrepWeeklyHours
            totalWeeklyRequiredHours += subjectTotalHours

            // Subject normalized score (0-100)
            val subScore = ((subjectTotalHours / 8.0f) * 60 + (pendingCh * 2.5f)).roundToInt().coerceIn(10, 100)

            subjectWorkloads.add(
                SubjectWorkload(
                    subjectId = subject.id,
                    subjectName = subject.name,
                    difficulty = subject.difficulty,
                    workloadScore = subScore,
                    requiredWeeklyHours = (subjectTotalHours * 10).roundToInt() / 10f,
                    pendingChapters = pendingCh,
                    pendingAssignments = pendingTasks.size,
                    examDaysRemaining = examDays
                )
            )

            // Heavy subject backlog alert
            if (pendingCh >= 6 && subject.difficulty.multiplier >= 2.0f) {
                riskFactors.add(
                    RiskFactor(
                        title = "High Backlog: ${subject.name}",
                        description = "$pendingCh pending chapters in a ${subject.difficulty.label} subject.",
                        severity = RiskSeverity.WARNING
                    )
                )
            }
        }

        // 2. Capacity analysis
        val safeDailyHours = dailyAvailableHours.coerceAtLeast(0.5f)
        val weeklyAvailableHours = safeDailyHours * 7.0f
        val capacityRatio = totalWeeklyRequiredHours / weeklyAvailableHours
        val capacityUtilizationPercent = (capacityRatio * 100).roundToInt().coerceAtLeast(0)

        // 3. Normalized Global Workload Score (0-100)
        // Deterministic algorithm:
        // Base from capacity ratio: capacityRatio * 45
        // Deadlines congestion factor: imminentDeadlinesCount * 7
        // Upcoming exams factor: upcomingExamsCount * 5
        // Unfinished chapters ratio factor: (pending/total) * 20
        val chaptersPendingRatio = if (totalAllChapters > 0) (totalPendingChapters.toFloat() / totalAllChapters) else 0.5f
        val rawScore = (capacityRatio * 44f) + (imminentDeadlinesCount * 7.5f) + (chaptersPendingRatio * 20f)
        val finalScore = rawScore.roundToInt().coerceIn(5, 100)
        val workloadLevel = WorkloadLevel.fromScore(finalScore)

        // Capacity deficit risk
        if (totalWeeklyRequiredHours > weeklyAvailableHours) {
            val deficit = ((totalWeeklyRequiredHours - weeklyAvailableHours) * 10).roundToInt() / 10f
            riskFactors.add(
                0,
                RiskFactor(
                    title = "Workload Deficit Detected",
                    description = "Required study hours (${(totalWeeklyRequiredHours * 10).roundToInt() / 10f}h/wk) exceed available capacity ($weeklyAvailableHours h/wk) by $deficit hours.",
                    severity = RiskSeverity.CRITICAL
                )
            )
        }

        // Recommended Hours
        val recommendedWeekly = if (totalWeeklyRequiredHours > weeklyAvailableHours) {
            totalWeeklyRequiredHours * 1.05f
        } else {
            (weeklyAvailableHours * 0.85f).coerceAtLeast(totalWeeklyRequiredHours)
        }
        val recommendedDaily = (recommendedWeekly / 7.0f * 10).roundToInt() / 10f

        val overallProgress = if (totalAllChapters > 0) {
            ((totalCompletedChapters.toFloat() / totalAllChapters) * 100).roundToInt().coerceIn(0, 100)
        } else 0

        val pendingAssignmentsTotal = tasks.count { !it.isCompleted && it.type == com.example.data.model.TaskType.ASSIGNMENT }

        return FullPrediction(
            workloadScore = finalScore,
            workloadLevel = workloadLevel,
            totalSubjects = subjects.size,
            totalPendingChapters = totalPendingChapters,
            pendingAssignments = pendingAssignmentsTotal,
            upcomingExamsCount = upcomingExamsCount,
            availableDailyHours = safeDailyHours,
            availableWeeklyHours = (weeklyAvailableHours * 10).roundToInt() / 10f,
            requiredWeeklyHours = (totalWeeklyRequiredHours * 10).roundToInt() / 10f,
            capacityUtilizationPercent = capacityUtilizationPercent,
            recommendedDailyHours = recommendedDaily,
            recommendedWeeklyHours = (recommendedWeekly * 10).roundToInt() / 10f,
            overallProgressPercent = overallProgress,
            subjectWorkloads = subjectWorkloads.sortedByDescending { it.workloadScore },
            riskFactors = riskFactors
        )
    }

    /**
     * What-If Simulator: Calculates modified workload based on simulated parameters
     */
    fun simulateWhatIf(
        basePrediction: FullPrediction,
        simulatedDailyHours: Float,
        extraCompletedChapters: Int,
        clearedAssignments: Int,
        examPrepBonus: Int
    ): SimulationResult {
        val safeHours = simulatedDailyHours.coerceAtLeast(0.5f)
        val simulatedWeeklyAvailable = safeHours * 7.0f

        // Adjust required weekly hours
        val chapterHoursSaved = extraCompletedChapters * 1.8f
        val assignmentHoursSaved = clearedAssignments * 1.5f
        val examHoursSaved = (examPrepBonus / 100f) * (basePrediction.upcomingExamsCount * 2.5f)

        val newRequiredWeeklyHours = (basePrediction.requiredWeeklyHours - (chapterHoursSaved + assignmentHoursSaved + examHoursSaved))
            .coerceAtLeast(1.0f)

        val newCapacityRatio = newRequiredWeeklyHours / simulatedWeeklyAvailable
        val simulatedCapacityPercent = (newCapacityRatio * 100).roundToInt().coerceAtLeast(0)

        val newRawScore = (newCapacityRatio * 44f) + ((basePrediction.pendingAssignments - clearedAssignments).coerceAtLeast(0) * 3f)
        val newScore = newRawScore.roundToInt().coerceIn(5, 100)
        val newLevel = WorkloadLevel.fromScore(newScore)

        val deltaScore = newScore - basePrediction.workloadScore

        return SimulationResult(
            originalScore = basePrediction.workloadScore,
            simulatedScore = newScore,
            scoreDelta = deltaScore,
            originalLevel = basePrediction.workloadLevel,
            simulatedLevel = newLevel,
            simulatedRequiredHours = (newRequiredWeeklyHours * 10).roundToInt() / 10f,
            simulatedCapacityPercent = simulatedCapacityPercent
        )
    }

    private fun getDaysRemaining(dateStr: String, nowMillis: Long): Int? {
        if (dateStr.isBlank()) return null
        return try {
            val target = dateFormat.parse(dateStr)?.time ?: return null
            val diffMillis = target - nowMillis
            val days = TimeUnit.MILLISECONDS.toDays(diffMillis).toInt()
            days.coerceAtLeast(0)
        } catch (_: Exception) {
            null
        }
    }
}

data class SimulationResult(
    val originalScore: Int,
    val simulatedScore: Int,
    val scoreDelta: Int,
    val originalLevel: WorkloadLevel,
    val simulatedLevel: WorkloadLevel,
    val simulatedRequiredHours: Float,
    val simulatedCapacityPercent: Int
)
