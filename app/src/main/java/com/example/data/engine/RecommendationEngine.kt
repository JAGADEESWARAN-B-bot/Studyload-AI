package com.example.data.engine

import android.util.Log
import com.example.BuildConfig
import com.example.data.model.FullPrediction
import com.example.data.model.Subject
import com.example.data.model.Task
import com.example.data.model.WorkloadLevel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

object RecommendationEngine {

    private const val TAG = "StudyLoadAI"
    private const val GEMINI_MODEL = "gemini-3.5-flash"
    private const val BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/"

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    suspend fun getRecommendations(
        prediction: FullPrediction,
        subjects: List<Subject>,
        tasks: List<Task>
    ): String = withContext(Dispatchers.IO) {
        val apiKey = try {
            BuildConfig.GEMINI_API_KEY
        } catch (_: Throwable) {
            ""
        }

        // If key is empty or placeholder, immediately return local fallback
        if (apiKey.isBlank() || apiKey == "MY_GEMINI_API_KEY" || apiKey == "null") {
            return@withContext generateLocalFallback(prediction, subjects, tasks)
        }

        try {
            val prompt = buildPrompt(prediction, subjects, tasks)
            val jsonBody = JSONObject().apply {
                val contents = JSONArray().apply {
                    val contentObj = JSONObject().apply {
                        val parts = JSONArray().apply {
                            put(JSONObject().apply {
                                put("text", prompt)
                            })
                        }
                        put("parts", parts)
                    }
                    put(contentObj)
                }
                put("contents", contents)

                val generationConfig = JSONObject().apply {
                    put("temperature", 0.6)
                    put("topP", 0.9)
                }
                put("generationConfig", generationConfig)
            }

            val requestBody = jsonBody.toString().toRequestBody("application/json".toMediaType())
            val request = Request.Builder()
                .url("${BASE_URL}${GEMINI_MODEL}:generateContent?key=${apiKey}")
                .post(requestBody)
                .build()

            val response = httpClient.newCall(request).execute()
            if (response.isSuccessful) {
                val responseStr = response.body?.string() ?: ""
                val rootJson = JSONObject(responseStr)
                val candidates = rootJson.optJSONArray("candidates")
                if (candidates != null && candidates.length() > 0) {
                    val content = candidates.getJSONObject(0).optJSONObject("content")
                    val parts = content?.optJSONArray("parts")
                    val text = parts?.optJSONObject(0)?.optString("text")
                    if (!text.isNullOrBlank()) {
                        return@withContext text.trim()
                    }
                }
            } else {
                Log.w(TAG, "Gemini API returned error code ${response.code}: ${response.message}")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Gemini API call failed, falling back to local engine", e)
        }

        // Robust Local Fallback
        return@withContext generateLocalFallback(prediction, subjects, tasks)
    }

    private fun buildPrompt(
        prediction: FullPrediction,
        subjects: List<Subject>,
        tasks: List<Task>
    ): String {
        val subjectListStr = subjects.joinToString("; ") {
            "${it.name} (Difficulty: ${it.difficulty.label}, ${it.pendingChapters} pending chapters, Exam: ${it.examDate.ifEmpty { "None" }})"
        }
        val taskListStr = tasks.filter { !it.isCompleted }.joinToString("; ") {
            "${it.title} (${it.subjectName}, Due: ${it.deadline})"
        }

        return """
            You are StudyLoad AI, an intelligent academic workload advisor.
            Analyze this student workload data:
            - Workload Score: ${prediction.workloadScore}/100 (${prediction.workloadLevel.label})
            - Available Study Hours: ${prediction.availableDailyHours} hrs/day (${prediction.availableWeeklyHours} hrs/week)
            - Required Study Hours: ${prediction.requiredWeeklyHours} hrs/week
            - Subjects: $subjectListStr
            - Pending Tasks: $taskListStr

            Provide concise, highly actionable academic advice formatted under these 4 sections:
            1. Priority Action: Exactly what to study first today.
            2. High Attention Subjects: Which subjects require immediate time allocation.
            3. Daily Strategy: How to split study blocks to avoid burnout.
            4. Study Technique Tip: One proven technique (e.g. Pomodoro, Feynman, Active Recall) suitable for their workload.
            Keep it inspiring, practical, and clear.
        """.trimIndent()
    }

    fun generateLocalFallback(
        prediction: FullPrediction,
        subjects: List<Subject>,
        tasks: List<Task>
    ): String {
        if (subjects.isEmpty()) {
            return "Welcome to StudyLoad AI! Add your enrolled academic subjects and upcoming deadlines to generate a personalized study plan."
        }

        val topSubject = prediction.subjectWorkloads.firstOrNull()?.subjectName ?: subjects.first().name
        val urgentTask = tasks.firstOrNull { !it.isCompleted }

        val priorityText = if (urgentTask != null) {
            "Immediately tackle '${urgentTask.title}' for ${urgentTask.subjectName} before deadline (${urgentTask.deadline})."
        } else {
            "Begin with $topSubject to clear chapter backlogs in your most demanding subject."
        }

        val strategyText = when (prediction.workloadLevel) {
            WorkloadLevel.LOW -> "Your workload is well-balanced. Dedicate ${prediction.recommendedDailyHours} hours/day to steady chapter reading and practice problems."
            WorkloadLevel.MODERATE -> "Moderate pace needed. Allocate 60% of your time to $topSubject and use 45-minute focused blocks with 10-minute active recall breaks."
            WorkloadLevel.HIGH -> "High workload detected! Protect a minimum of ${prediction.recommendedDailyHours} hours/day. Defer non-critical activities and prioritize upcoming assignment submissions."
            WorkloadLevel.VERY_HIGH -> "Critical workload alert! Your required hours exceed weekly capacity. Focus strictly on passing exam topics and high-value assignments. Break study into 25-minute Pomodoro sprints to maintain endurance."
        }

        return """
            🎯 Priority Action:
            $priorityText

            📚 Subject Focus:
            Allocate highest attention to $topSubject (${prediction.subjectWorkloads.firstOrNull()?.difficulty?.label ?: "High"} difficulty). Spread remaining time evenly across lighter subjects.

            ⏱️ Suggested Daily Plan:
            Aim for ${prediction.recommendedDailyHours} hours/day in split blocks (e.g., 5:00 PM - 6:30 PM & 7:00 PM - 8:30 PM).

            💡 Study Technique:
            Use the Pomodoro Technique (50 min deep study + 10 min break) combined with Active Recall (flashcards / summary recall without looking at notes).
        """.trimIndent()
    }
}
