package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.FullPrediction
import com.example.data.model.Subject
import com.example.ui.components.EmptyStateView
import com.example.ui.components.MetricCard
import com.example.ui.components.RiskFactorCard
import com.example.ui.components.WorkloadGauge
import com.example.ui.viewmodel.WhatIfState

@Composable
fun PredictionScreen(
    prediction: FullPrediction,
    subjects: List<Subject>,
    whatIfState: WhatIfState,
    aiRecommendation: String,
    isLoadingAi: Boolean,
    onSavePredictionSnapshot: () -> Unit,
    onUpdateWhatIf: (Float, Int, Int, Int) -> Unit,
    onRefreshAi: () -> Unit,
    onNavigateToInput: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (subjects.isEmpty()) {
        EmptyStateView(
            title = "No Prediction Data",
            description = "Add your academic courses to calculate workload scores, risk factors, and study forecasts.",
            actionButtonText = "Add Courses Now",
            onActionClick = onNavigateToInput,
            modifier = modifier.fillMaxSize()
        )
        return
    }

    var sliderDailyHoursDelta by remember { mutableFloatStateOf(whatIfState.dailyHoursDelta) }
    var sliderExtraChapters by remember { mutableIntStateOf(whatIfState.extraCompletedChapters) }
    var sliderClearedAssignments by remember { mutableIntStateOf(whatIfState.clearedAssignments) }
    var sliderExamBonus by remember { mutableIntStateOf(whatIfState.examPrepBonusPercent) }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Workload Prediction Engine",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "Deterministic, explainable academic workload model",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                IconButton(
                    onClick = onSavePredictionSnapshot,
                    modifier = Modifier.testTag("save_prediction_snapshot_btn")
                ) {
                    Icon(
                        imageVector = Icons.Default.BookmarkBorder,
                        contentDescription = "Save Snapshot",
                        tint = Color(0xFF4F46E5)
                    )
                }
            }
        }

        // Main Prediction Card
        item {
            Card(
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
                    WorkloadGauge(
                        score = prediction.workloadScore,
                        level = prediction.workloadLevel
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "${prediction.recommendedDailyHours}h",
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                color = Color(0xFF4F46E5)
                            )
                            Text(text = "Target Daily Study", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "${prediction.recommendedWeeklyHours}h",
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                color = Color(0xFF0284C7)
                            )
                            Text(text = "Target Weekly Study", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "${prediction.capacityUtilizationPercent}%",
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                color = Color(prediction.workloadLevel.colorHex)
                            )
                            Text(text = "Capacity Stress", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }

        // Section: WHAT-IF STUDY SIMULATOR
        item {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.testTag("what_if_simulator_card")
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .background(Color(0xFFEEF2FF), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Tune,
                                contentDescription = null,
                                tint = Color(0xFF4F46E5),
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "What-If Study Simulator",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                            Text(
                                text = "Adjust study hours and progress to see instant score drops",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Slider 1: Study hours delta
                    val simulatedHours = (prediction.availableDailyHours + sliderDailyHoursDelta).coerceAtLeast(0.5f)
                    Text(
                        text = "Daily Study Time: ${(simulatedHours * 10).toInt() / 10f} hrs/day (${if (sliderDailyHoursDelta >= 0) "+${sliderDailyHoursDelta}h" else "${sliderDailyHoursDelta}h"})",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Slider(
                        value = sliderDailyHoursDelta,
                        onValueChange = {
                            sliderDailyHoursDelta = (it * 2).toInt() / 2f
                            onUpdateWhatIf(sliderDailyHoursDelta, sliderExtraChapters, sliderClearedAssignments, sliderExamBonus)
                        },
                        valueRange = -2f..4f,
                        steps = 11,
                        modifier = Modifier.testTag("slider_what_if_hours")
                    )

                    // Slider 2: Extra completed chapters
                    Text(
                        text = "Complete Additional Chapters: +$sliderExtraChapters chapters",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Slider(
                        value = sliderExtraChapters.toFloat(),
                        onValueChange = {
                            sliderExtraChapters = it.toInt()
                            onUpdateWhatIf(sliderDailyHoursDelta, sliderExtraChapters, sliderClearedAssignments, sliderExamBonus)
                        },
                        valueRange = 0f..8f,
                        steps = 7,
                        modifier = Modifier.testTag("slider_what_if_chapters")
                    )

                    // Slider 3: Clear assignments
                    val maxAssignments = prediction.pendingAssignments.coerceAtLeast(1)
                    Text(
                        text = "Finish Pending Assignments: $sliderClearedAssignments completed",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Slider(
                        value = sliderClearedAssignments.toFloat(),
                        onValueChange = {
                            sliderClearedAssignments = it.toInt()
                            onUpdateWhatIf(sliderDailyHoursDelta, sliderExtraChapters, sliderClearedAssignments, sliderExamBonus)
                        },
                        valueRange = 0f..maxAssignments.toFloat(),
                        steps = (maxAssignments - 1).coerceAtLeast(0),
                        modifier = Modifier.testTag("slider_what_if_assignments")
                    )

                    // Slider 4: Exam prep bonus
                    Text(
                        text = "Boost Exam Readiness: +$sliderExamBonus%",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Slider(
                        value = sliderExamBonus.toFloat(),
                        onValueChange = {
                            sliderExamBonus = it.toInt()
                            onUpdateWhatIf(sliderDailyHoursDelta, sliderExtraChapters, sliderClearedAssignments, sliderExamBonus)
                        },
                        valueRange = 0f..40f,
                        steps = 7,
                        modifier = Modifier.testTag("slider_what_if_exam_prep")
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Simulation Outcome Banner
                    val simResult = whatIfState.simulationResult
                    if (simResult != null) {
                        Card(
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (simResult.scoreDelta < 0) Color(0xFFF0FDF4) else Color(0xFFF8FAFC)
                            ),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(
                                            text = "Simulated Score",
                                            fontSize = 12.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                        Row(verticalAlignment = Alignment.Bottom) {
                                            Text(
                                                text = "${simResult.simulatedScore}",
                                                fontSize = 28.sp,
                                                fontWeight = FontWeight.ExtraBold,
                                                color = Color(simResult.simulatedLevel.colorHex)
                                            )
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Text(
                                                text = "(${simResult.simulatedLevel.label})",
                                                fontSize = 13.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = Color(simResult.simulatedLevel.colorHex)
                                            )
                                        }
                                    }

                                    // Score Delta Indicator
                                    Box(
                                        modifier = Modifier
                                            .background(
                                                color = if (simResult.scoreDelta <= 0) Color(0xFF10B981) else Color(0xFFEF4444),
                                                shape = RoundedCornerShape(10.dp)
                                            )
                                            .padding(horizontal = 12.dp, vertical = 6.dp)
                                    ) {
                                        Text(
                                            text = "${if (simResult.scoreDelta > 0) "+" else ""}${simResult.scoreDelta} pts",
                                            color = Color.White,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = if (simResult.scoreDelta < 0) {
                                        "By executing these adjustments, your weekly required hours drop to ${simResult.simulatedRequiredHours}h, lowering capacity stress to ${simResult.simulatedCapacityPercent}%."
                                    } else {
                                        "Base workload is ${simResult.originalScore} pts (${simResult.originalLevel.label})."
                                    },
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    lineHeight = 16.sp
                                )
                            }
                        }
                    }
                }
            }
        }

        // Section: AI STUDY RECOMMENDATIONS
        item {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(34.dp)
                                    .background(Color(0xFFEEF2FF), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.AutoAwesome,
                                    contentDescription = null,
                                    tint = Color(0xFF4F46E5),
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "AI Study Recommendations",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                        }

                        IconButton(
                            onClick = onRefreshAi,
                            enabled = !isLoadingAi,
                            modifier = Modifier.testTag("refresh_ai_btn")
                        ) {
                            if (isLoadingAi) {
                                CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                            } else {
                                Icon(
                                    imageVector = Icons.Default.Refresh,
                                    contentDescription = "Refresh",
                                    tint = Color(0xFF4F46E5)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    if (aiRecommendation.isBlank() && !isLoadingAi) {
                        Button(
                            onClick = onRefreshAi,
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "Generate AI Study Recommendations")
                        }
                    } else {
                        Text(
                            text = aiRecommendation,
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.onSurface,
                            lineHeight = 18.sp
                        )
                    }
                }
            }
        }

        // Risk Factors List
        if (prediction.riskFactors.isNotEmpty()) {
            item {
                Text(
                    text = "Identified Risk Factors (${prediction.riskFactors.size})",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Spacer(modifier = Modifier.height(8.dp))
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    prediction.riskFactors.forEach { risk ->
                        RiskFactorCard(risk = risk)
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}
