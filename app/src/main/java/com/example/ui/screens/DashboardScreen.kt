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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.FullPrediction
import com.example.data.model.Subject
import com.example.data.model.Task
import com.example.data.model.UserProfile
import com.example.ui.components.EmptyStateView
import com.example.ui.components.MetricCard
import com.example.ui.components.RiskFactorCard
import com.example.ui.components.SubjectWorkloadBarChart
import com.example.ui.components.TaskCompletionChart
import com.example.ui.components.WorkloadGauge

@Composable
fun DashboardScreen(
    profile: UserProfile,
    subjects: List<Subject>,
    tasks: List<Task>,
    prediction: FullPrediction,
    onNavigateToInput: () -> Unit,
    onNavigateToPrediction: () -> Unit,
    onNavigateToSchedule: () -> Unit,
    onLoadDemoData: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (subjects.isEmpty()) {
        EmptyStateView(
            title = "No study data available yet",
            description = "Start by adding your course curriculum or load our academic demo dataset to explore workload prediction.",
            actionButtonText = "Create Study Plan",
            onActionClick = onNavigateToInput,
            modifier = modifier.fillMaxSize()
        )
        return
    }

    val pendingTasksCount = tasks.count { !it.isCompleted }
    val completedTasksCount = tasks.count { it.isCompleted }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcome Header & Quick Action Row
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Hello, ${profile.studentName} 👋",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "${profile.course} • ${profile.semester}",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                OutlinedButton(
                    onClick = onNavigateToInput,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.testTag("dashboard_add_data_btn")
                ) {
                    Icon(imageVector = Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Add Course", fontSize = 12.sp)
                }
            }
        }

        // Summary Metric Cards 2x2 Grid
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    MetricCard(
                        title = "Total Subjects",
                        value = "${prediction.totalSubjects}",
                        subtext = "${prediction.totalPendingChapters} chapters left",
                        icon = Icons.Default.Book,
                        accentColor = Color(0xFF4F46E5),
                        modifier = Modifier.weight(1f)
                    )
                    MetricCard(
                        title = "Pending Tasks",
                        value = "$pendingTasksCount",
                        subtext = "${prediction.pendingAssignments} assignments",
                        icon = Icons.Default.Assignment,
                        accentColor = Color(0xFFF59E0B),
                        modifier = Modifier.weight(1f)
                    )
                }
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    MetricCard(
                        title = "Upcoming Exams",
                        value = "${prediction.upcomingExamsCount}",
                        subtext = "In next 30 days",
                        icon = Icons.Default.DateRange,
                        accentColor = Color(0xFFEF4444),
                        modifier = Modifier.weight(1f)
                    )
                    MetricCard(
                        title = "Available Hours",
                        value = "${prediction.availableDailyHours}h / day",
                        subtext = "${prediction.availableWeeklyHours}h weekly limit",
                        icon = Icons.Default.Schedule,
                        accentColor = Color(0xFF10B981),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // Current Workload Prediction Gauge Card
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("dashboard_workload_card"),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Current Study Workload",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "Capacity: ${prediction.capacityUtilizationPercent}%",
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 12.sp,
                            color = Color(prediction.workloadLevel.colorHex)
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    WorkloadGauge(
                        score = prediction.workloadScore,
                        level = prediction.workloadLevel
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    // Weekly hours comparison bar
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "${prediction.requiredWeeklyHours} hrs",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = Color(0xFF4F46E5)
                            )
                            Text(text = "Required / Week", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "${prediction.availableWeeklyHours} hrs",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = Color(0xFF10B981)
                            )
                            Text(text = "Available / Week", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "${prediction.recommendedDailyHours} hrs",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = Color(0xFF0284C7)
                            )
                            Text(text = "Recommended / Day", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Button(
                            onClick = onNavigateToPrediction,
                            modifier = Modifier
                                .weight(1f)
                                .testTag("dashboard_what_if_button"),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4F46E5))
                        ) {
                            Icon(imageVector = Icons.Default.Tune, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "What-If Simulator", fontSize = 13.sp)
                        }
                        OutlinedButton(
                            onClick = onNavigateToSchedule,
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(imageVector = Icons.Default.CalendarMonth, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "View Schedule", fontSize = 13.sp)
                        }
                    }
                }
            }
        }

        // Risk Factors / Deadlines Alert
        if (prediction.riskFactors.isNotEmpty()) {
            item {
                Text(
                    text = "Workload Risks & Deadline Alerts",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Spacer(modifier = Modifier.height(8.dp))
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    prediction.riskFactors.take(3).forEach { risk ->
                        RiskFactorCard(risk = risk)
                    }
                }
            }
        }

        // Subject Workload Chart
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = "Subject-Wise Workload Pressure",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    SubjectWorkloadBarChart(subjectWorkloads = prediction.subjectWorkloads)
                }
            }
        }

        // Task Completion Breakdown Chart
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 20.dp),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = "Task & Assignment Progress",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    TaskCompletionChart(
                        completedCount = completedTasksCount,
                        pendingCount = pendingTasksCount
                    )
                }
            }
        }
    }
}
