package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class TaskType(val label: String) {
    ASSIGNMENT("Assignment"),
    EXAM("Exam"),
    CHAPTER("Chapter"),
    REVISION("Revision")
}

enum class TaskPriority(val label: String, val weight: Float, val colorHex: Long) {
    LOW("Low", 1.0f, 0xFF10B981),
    MEDIUM("Medium", 1.5f, 0xFF0284C7),
    HIGH("High", 2.0f, 0xFFF59E0B),
    URGENT("Urgent", 3.0f, 0xFFEF4444)
}

@Entity(tableName = "tasks")
data class Task(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val userId: String = "default_user",
    val title: String,
    val subjectId: Long = 0,
    val subjectName: String = "",
    val type: TaskType = TaskType.ASSIGNMENT,
    val deadline: String = "", // YYYY-MM-DD
    val priority: TaskPriority = TaskPriority.MEDIUM,
    val isCompleted: Boolean = false,
    val estimatedHours: Float = 2.0f,
    val notes: String = ""
)
