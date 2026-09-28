package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class DayOfWeekEnum(val fullName: String, val shortName: String) {
    MONDAY("Monday", "Mon"),
    TUESDAY("Tuesday", "Tue"),
    WEDNESDAY("Wednesday", "Wed"),
    THURSDAY("Thursday", "Thu"),
    FRIDAY("Friday", "Fri"),
    SATURDAY("Saturday", "Sat"),
    SUNDAY("Sunday", "Sun")
}

@Entity(tableName = "study_schedules")
data class ScheduleSlot(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val userId: String = "default_user",
    val dayOfWeek: DayOfWeekEnum,
    val startTime: String, // e.g., "17:00"
    val endTime: String,   // e.g., "18:15"
    val durationMinutes: Int = 75,
    val subjectName: String,
    val topicDescription: String,
    val isRevision: Boolean = false,
    val colorHex: Long = 0xFF4F46E5
)
