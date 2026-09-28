package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ErrorOutline
import androidx.compose.material.icons.filled.School
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.SubjectDifficulty
import com.example.data.model.UserProfile

@Composable
fun InputScreen(
    profile: UserProfile,
    onSaveProfile: (String, String, String, Float, String) -> Unit,
    onAddSubject: (String, String, SubjectDifficulty, Int, Int, String, Int, String) -> Unit,
    onNavigateToPrediction: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Profile inputs
    var studentName by remember(profile.studentName) { mutableStateOf(profile.studentName) }
    var courseName by remember(profile.course) { mutableStateOf(profile.course) }
    var semester by remember(profile.semester) { mutableStateOf(profile.semester) }
    var dailyHoursStr by remember(profile.dailyAvailableHours) { mutableStateOf("${profile.dailyAvailableHours}") }

    // Subject inputs
    var subjectName by remember { mutableStateOf("") }
    var subjectCode by remember { mutableStateOf("") }
    var selectedDifficulty by remember { mutableStateOf(SubjectDifficulty.MEDIUM) }
    var totalChaptersStr by remember { mutableStateOf("10") }
    var completedChaptersStr by remember { mutableStateOf("3") }
    var assignmentDeadline by remember { mutableStateOf("") }
    var examDate by remember { mutableStateOf("") }
    var examPrepPercent by remember { mutableFloatStateOf(40f) }
    var subjectNotes by remember { mutableStateOf("") }

    // Validation state
    var validationError by remember { mutableStateOf<String?>(null) }
    var successNotice by remember { mutableStateOf<String?>(null) }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Study Workload Input Form",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Text(
                text = "Provide your academic details to calculate accurate workload forecasts.",
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Section 1: Student Profile & Availability
        item {
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.School,
                            contentDescription = null,
                            tint = Color(0xFF4F46E5)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Student Profile & Capacity",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp
                        )
                    }

                    OutlinedTextField(
                        value = studentName,
                        onValueChange = { studentName = it },
                        label = { Text("Student Name") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_student_name"),
                        singleLine = true
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedTextField(
                            value = courseName,
                            onValueChange = { courseName = it },
                            label = { Text("Course / Major") },
                            modifier = Modifier.weight(1.3f),
                            singleLine = true
                        )
                        OutlinedTextField(
                            value = semester,
                            onValueChange = { semester = it },
                            label = { Text("Semester") },
                            modifier = Modifier.weight(1f),
                            singleLine = true
                        )
                    }

                    OutlinedTextField(
                        value = dailyHoursStr,
                        onValueChange = { dailyHoursStr = it },
                        label = { Text("Daily Available Study Hours (e.g. 3.5)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_daily_hours"),
                        singleLine = true
                    )
                }
            }
        }

        // Section 2: Subject Details
        item {
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Add Course / Subject",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )

                    OutlinedTextField(
                        value = subjectName,
                        onValueChange = { subjectName = it },
                        label = { Text("Subject Name (e.g. Data Structures)") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_subject_name"),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = subjectCode,
                        onValueChange = { subjectCode = it },
                        label = { Text("Course Code (Optional, e.g. CS-301)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Text(
                        text = "Subject Difficulty Level",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        SubjectDifficulty.entries.forEach { diff ->
                            FilterChip(
                                selected = selectedDifficulty == diff,
                                onClick = { selectedDifficulty = diff },
                                label = { Text(diff.label, fontSize = 11.sp) },
                                modifier = Modifier.testTag("chip_diff_${diff.name.lowercase()}")
                            )
                        }
                    }

                    // Chapter counts
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedTextField(
                            value = totalChaptersStr,
                            onValueChange = { totalChaptersStr = it },
                            label = { Text("Total Chapters") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier
                                .weight(1f)
                                .testTag("input_total_chapters"),
                            singleLine = true
                        )
                        OutlinedTextField(
                            value = completedChaptersStr,
                            onValueChange = { completedChaptersStr = it },
                            label = { Text("Completed Chapters") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier
                                .weight(1f)
                                .testTag("input_completed_chapters"),
                            singleLine = true
                        )
                    }

                    val totalCh = totalChaptersStr.toIntOrNull() ?: 0
                    val compCh = completedChaptersStr.toIntOrNull() ?: 0
                    val pendingCh = (totalCh - compCh).coerceAtLeast(0)
                    Text(
                        text = "Pending Chapters: $pendingCh (${if (totalCh > 0) (compCh * 100 / totalCh) else 0}% completed)",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    // Upcoming deadlines
                    OutlinedTextField(
                        value = assignmentDeadline,
                        onValueChange = { assignmentDeadline = it },
                        label = { Text("Assignment Deadline (YYYY-MM-DD)") },
                        placeholder = { Text("e.g. 2026-10-05") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = examDate,
                        onValueChange = { examDate = it },
                        label = { Text("Upcoming Exam Date (YYYY-MM-DD)") },
                        placeholder = { Text("e.g. 2026-10-15") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    // Exam Prep percentage slider
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Exam Readiness Percentage", fontSize = 13.sp)
                            Text(
                                text = "${examPrepPercent.toInt()}%",
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF4F46E5)
                            )
                        }
                        Slider(
                            value = examPrepPercent,
                            onValueChange = { examPrepPercent = it },
                            valueRange = 0f..100f,
                            modifier = Modifier.testTag("slider_exam_prep")
                        )
                    }

                    OutlinedTextField(
                        value = subjectNotes,
                        onValueChange = { subjectNotes = it },
                        label = { Text("Additional Notes & Topics") },
                        modifier = Modifier.fillMaxWidth(),
                        maxLines = 2
                    )

                    // Validation Message Banner
                    if (validationError != null) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFFEF2F2), RoundedCornerShape(8.dp))
                                .padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(imageVector = Icons.Default.ErrorOutline, contentDescription = null, tint = Color(0xFFEF4444))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = validationError ?: "",
                                fontSize = 12.sp,
                                color = Color(0xFFB91C1C),
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }

                    if (successNotice != null) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFF0FDF4), RoundedCornerShape(8.dp))
                                .padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFF10B981))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = successNotice ?: "",
                                fontSize = 12.sp,
                                color = Color(0xFF047857),
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }

                    Button(
                        onClick = {
                            // Validation checks
                            val dailyHours = dailyHoursStr.toFloatOrNull()
                            if (dailyHours == null || dailyHours <= 0f) {
                                validationError = "Daily study hours must be a positive number (e.g. 3.5)."
                                return@Button
                            }
                            if (dailyHours > 16f) {
                                validationError = "Daily study hours cannot exceed 16 hours."
                                return@Button
                            }
                            if (subjectName.isBlank()) {
                                validationError = "Please enter a valid Subject Name."
                                return@Button
                            }
                            val tChapters = totalChaptersStr.toIntOrNull()
                            val cChapters = completedChaptersStr.toIntOrNull()
                            if (tChapters == null || tChapters <= 0) {
                                validationError = "Total chapters must be at least 1."
                                return@Button
                            }
                            if (cChapters == null || cChapters < 0) {
                                validationError = "Completed chapters cannot be negative."
                                return@Button
                            }
                            if (cChapters > tChapters) {
                                validationError = "Completed chapters ($cChapters) cannot exceed total chapters ($tChapters)."
                                return@Button
                            }

                            validationError = null
                            // Save profile
                            onSaveProfile(studentName, courseName, semester, dailyHours, profile.preferredStudyStartTime)
                            // Add subject
                            onAddSubject(
                                subjectName,
                                subjectCode,
                                selectedDifficulty,
                                tChapters,
                                cChapters,
                                examDate,
                                examPrepPercent.toInt(),
                                subjectNotes
                            )
                            successNotice = "Course '$subjectName' saved & prediction updated!"
                            // Reset subject fields
                            subjectName = ""
                            subjectCode = ""
                            totalChaptersStr = "10"
                            completedChaptersStr = "0"
                            assignmentDeadline = ""
                            examDate = ""
                            examPrepPercent = 30f
                            subjectNotes = ""
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("save_subject_button"),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4F46E5))
                    ) {
                        Icon(imageVector = Icons.Default.Add, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Save Course & Recalculate Workload", fontWeight = FontWeight.Bold)
                    }

                    Button(
                        onClick = onNavigateToPrediction,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("view_prediction_results_btn"),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0284C7))
                    ) {
                        Text(text = "View Workload Prediction & Simulation →", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
