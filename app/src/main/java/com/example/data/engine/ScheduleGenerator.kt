package com.example.data.engine

import com.example.data.model.DayOfWeekEnum
import com.example.data.model.ScheduleSlot
import com.example.data.model.Subject
import com.example.data.model.SubjectDifficulty
import com.example.data.model.Task
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

object ScheduleGenerator {

    fun generateWeeklySchedule(
        subjects: List<Subject>,
        tasks: List<Task>,
        dailyHours: Float,
        preferredStartTimeStr: String = "17:00"
    ): List<ScheduleSlot> {
        if (subjects.isEmpty()) return emptyList()

        val slots = mutableListOf<ScheduleSlot>()
        val sortedSubjects = subjects.sortedWith(
            compareByDescending<Subject> { it.difficulty.multiplier }
                .thenByDescending { it.pendingChapters }
        )

        // Parse start time
        val (startHour, startMinute) = try {
            val parts = preferredStartTimeStr.split(":")
            Pair(parts[0].toInt(), parts[1].toInt())
        } catch (_: Exception) {
            Pair(17, 0)
        }

        // Sessions per day: split daily hours into 1h - 1.5h sessions with 15-min break
        val sessionCount = when {
            dailyHours <= 1.5f -> 1
            dailyHours <= 3.0f -> 2
            dailyHours <= 4.5f -> 3
            else -> 4
        }
        val sessionMinutes = ((dailyHours * 60) / sessionCount).toInt().coerceIn(45, 90)

        val days = DayOfWeekEnum.entries
        var subjectIndex = 0

        for (day in days) {
            var currentCal = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, startHour)
                set(Calendar.MINUTE, startMinute)
                set(Calendar.SECOND, 0)
            }

            for (session in 0 until sessionCount) {
                val subject = sortedSubjects[subjectIndex % sortedSubjects.size]
                subjectIndex++

                val startStr = formatTime(currentCal)
                currentCal.add(Calendar.MINUTE, sessionMinutes)
                val endStr = formatTime(currentCal)

                // Determine task / topic
                val relatedTask = tasks.firstOrNull {
                    !it.isCompleted && (it.subjectId == subject.id || it.subjectName.equals(subject.name, ignoreCase = true))
                }

                val topic = when {
                    relatedTask != null -> "Work on: ${relatedTask.title}"
                    subject.pendingChapters > 0 -> "Study Chapter ${subject.completedChapters + 1}: Core Concepts"
                    subject.examDate.isNotBlank() -> "Exam Prep & High-Yield Practice"
                    else -> "Revision & Problem Solving"
                }

                val isRevision = day == DayOfWeekEnum.SATURDAY || day == DayOfWeekEnum.SUNDAY || session == sessionCount - 1

                slots.add(
                    ScheduleSlot(
                        dayOfWeek = day,
                        startTime = startStr,
                        endTime = endStr,
                        durationMinutes = sessionMinutes,
                        subjectName = subject.name,
                        topicDescription = topic,
                        isRevision = isRevision,
                        colorHex = subject.colorHex
                    )
                )

                // 15-minute break
                currentCal.add(Calendar.MINUTE, 15)
            }
        }

        return slots
    }

    private fun formatTime(cal: Calendar): String {
        val sdf = SimpleDateFormat("h:mm a", Locale.US)
        return sdf.format(cal.time)
    }
}
