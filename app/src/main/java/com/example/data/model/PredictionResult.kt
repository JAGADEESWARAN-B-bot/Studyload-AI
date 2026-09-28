package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class WorkloadLevel(val label: String, val minScore: Int, val maxScore: Int, val colorHex: Long, val badgeBgHex: Long) {
    LOW("LOW", 0, 24, 0xFF10B981, 0xFFD1FAE5),
    MODERATE("MODERATE", 25, 49, 0xFF0284C7, 0xFFE0F2FE),
    HIGH("HIGH", 50, 74, 0xFFF59E0B, 0xFFFEF3C7),
    VERY_HIGH("VERY HIGH", 75, 100, 0xFFEF4444, 0xFFFEE2E2);

    companion object {
        fun fromScore(score: Int): WorkloadLevel {
            val clamped = score.coerceIn(0, 100)
            return when {
                clamped <= 24 -> LOW
                clamped <= 49 -> MODERATE
                clamped <= 74 -> HIGH
                else -> VERY_HIGH
            }
        }
    }
}

data class SubjectWorkload(
    val subjectId: Long,
    val subjectName: String,
    val difficulty: SubjectDifficulty,
    val workloadScore: Int,
    val requiredWeeklyHours: Float,
    val pendingChapters: Int,
    val pendingAssignments: Int,
    val examDaysRemaining: Int?
)

data class RiskFactor(
    val title: String,
    val description: String,
    val severity: RiskSeverity
)

enum class RiskSeverity {
    INFO,
    WARNING,
    CRITICAL
}

@Entity(tableName = "predictions")
data class PredictionRecord(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val userId: String = "default_user",
    val timestamp: Long = System.currentTimeMillis(),
    val dateString: String = "",
    val workloadScore: Int = 0,
    val workloadLevel: WorkloadLevel = WorkloadLevel.LOW,
    val totalSubjects: Int = 0,
    val pendingTasks: Int = 0,
    val availableHoursPerDay: Float = 0f,
    val recommendedDailyHours: Float = 0f,
    val recommendedWeeklyHours: Float = 0f,
    val summaryNotes: String = ""
)

data class FullPrediction(
    val workloadScore: Int,
    val workloadLevel: WorkloadLevel,
    val totalSubjects: Int,
    val totalPendingChapters: Int,
    val pendingAssignments: Int,
    val upcomingExamsCount: Int,
    val availableDailyHours: Float,
    val availableWeeklyHours: Float,
    val requiredWeeklyHours: Float,
    val capacityUtilizationPercent: Int,
    val recommendedDailyHours: Float,
    val recommendedWeeklyHours: Float,
    val overallProgressPercent: Int,
    val subjectWorkloads: List<SubjectWorkload>,
    val riskFactors: List<RiskFactor>,
    val aiRecommendation: String = ""
)
