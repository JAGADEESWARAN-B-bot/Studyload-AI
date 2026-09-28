package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class SubjectDifficulty(val label: String, val multiplier: Float, val colorHex: Long) {
    EASY("Easy", 1.0f, 0xFF10B981),
    MEDIUM("Medium", 1.5f, 0xFF0284C7),
    HARD("Hard", 2.2f, 0xFFF59E0B),
    VERY_HARD("Very Hard", 3.0f, 0xFFEF4444);

    companion object {
        fun fromString(value: String): SubjectDifficulty {
            return entries.find { it.name.equals(value, ignoreCase = true) || it.label.equals(value, ignoreCase = true) }
                ?: MEDIUM
        }
    }
}

@Entity(tableName = "subjects")
data class Subject(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val userId: String = "default_user",
    val name: String,
    val code: String = "",
    val difficulty: SubjectDifficulty = SubjectDifficulty.MEDIUM,
    val totalChapters: Int = 10,
    val completedChapters: Int = 0,
    val examDate: String = "", // YYYY-MM-DD
    val examPrepPercentage: Int = 0, // 0-100
    val pendingAssignmentsCount: Int = 0,
    val assignmentDeadline: String = "", // YYYY-MM-DD
    val notes: String = "",
    val colorHex: Long = 0xFF4F46E5
) {
    val pendingChapters: Int
        get() = (totalChapters - completedChapters).coerceAtLeast(0)

    val progressPercentage: Int
        get() = if (totalChapters > 0) ((completedChapters.toFloat() / totalChapters) * 100).toInt().coerceIn(0, 100) else 0
}
