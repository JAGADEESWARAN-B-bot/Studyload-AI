package com.example

import com.example.data.engine.WorkloadCalculator
import com.example.data.model.Subject
import com.example.data.model.SubjectDifficulty
import com.example.data.model.Task
import com.example.data.model.TaskPriority
import com.example.data.model.TaskType
import com.example.data.model.WorkloadLevel
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ExampleUnitTest {

    @Test
    fun testEmptySubjectsWorkloadIsLow() {
        val prediction = WorkloadCalculator.calculateWorkload(emptyList(), emptyList(), 4.0f)
        assertEquals(0, prediction.workloadScore)
        assertEquals(WorkloadLevel.LOW, prediction.workloadLevel)
        assertEquals(0, prediction.totalSubjects)
    }

    @Test
    fun testWorkloadCalculationWithHeavyCourses() {
        val subjects = listOf(
            Subject(
                name = "Artificial Intelligence",
                difficulty = SubjectDifficulty.HARD,
                totalChapters = 12,
                completedChapters = 3,
                examDate = "2026-10-05",
                examPrepPercentage = 30
            ),
            Subject(
                name = "Data Structures",
                difficulty = SubjectDifficulty.VERY_HARD,
                totalChapters = 14,
                completedChapters = 4,
                examDate = "2026-10-08",
                examPrepPercentage = 25
            )
        )
        val tasks = listOf(
            Task(
                title = "AI Lab 3",
                subjectName = "Artificial Intelligence",
                type = TaskType.ASSIGNMENT,
                deadline = "2026-10-02",
                priority = TaskPriority.URGENT,
                estimatedHours = 4.0f
            )
        )

        val prediction = WorkloadCalculator.calculateWorkload(subjects, tasks, 2.0f)
        assertTrue("Workload score should be high or very high", prediction.workloadScore >= 50)
        assertTrue("Risk factors should be identified", prediction.riskFactors.isNotEmpty())
    }

    @Test
    fun testWhatIfSimulatorDecreasesScoreWhenHoursIncrease() {
        val subjects = listOf(
            Subject(
                name = "Database Management",
                difficulty = SubjectDifficulty.HARD,
                totalChapters = 10,
                completedChapters = 4
            )
        )
        val tasks = listOf(
            Task(
                title = "SQL Assignment",
                subjectName = "Database Management",
                type = TaskType.ASSIGNMENT,
                deadline = "2026-10-04",
                estimatedHours = 3.0f
            )
        )

        val basePrediction = WorkloadCalculator.calculateWorkload(subjects, tasks, 2.0f)
        val simResult = WorkloadCalculator.simulateWhatIf(
            basePrediction = basePrediction,
            simulatedDailyHours = 5.0f,
            extraCompletedChapters = 3,
            clearedAssignments = 1,
            examPrepBonus = 20
        )

        assertTrue(
            "Simulated score (${simResult.simulatedScore}) should be lower than original (${simResult.originalScore})",
            simResult.simulatedScore <= simResult.originalScore
        )
        assertTrue(simResult.scoreDelta <= 0)
    }
}
