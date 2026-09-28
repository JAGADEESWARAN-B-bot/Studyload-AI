package com.example.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.PredictionRecord
import com.example.data.model.SubjectWorkload

@Composable
fun SubjectWorkloadBarChart(
    subjectWorkloads: List<SubjectWorkload>,
    modifier: Modifier = Modifier
) {
    if (subjectWorkloads.isEmpty()) {
        Text(
            text = "No subjects available for workload chart.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(16.dp)
        )
        return
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .testTag("subject_workload_chart"),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        subjectWorkloads.forEach { sub ->
            val fraction = (sub.workloadScore / 100f).coerceIn(0f, 1f)
            val barColor = when {
                sub.workloadScore < 25 -> Color(0xFF10B981)
                sub.workloadScore < 50 -> Color(0xFF0284C7)
                sub.workloadScore < 75 -> Color(0xFFF59E0B)
                else -> Color(0xFFEF4444)
            }

            Column(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = sub.subjectName,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurface,
                        maxLines = 1,
                        modifier = Modifier.weight(1f)
                    )
                    Text(
                        text = "${sub.workloadScore} pts (${sub.requiredWeeklyHours}h/wk)",
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        color = barColor
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Canvas(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(10.dp)
                ) {
                    // Background rail
                    drawRoundRect(
                        color = Color(0xFFE2E8F0),
                        cornerRadius = CornerRadius(5.dp.toPx(), 5.dp.toPx()),
                        size = size
                    )
                    // Filled progress
                    drawRoundRect(
                        color = barColor,
                        cornerRadius = CornerRadius(5.dp.toPx(), 5.dp.toPx()),
                        size = Size(width = size.width * fraction, height = size.height)
                    )
                }
            }
        }
    }
}

@Composable
fun TaskCompletionChart(
    completedCount: Int,
    pendingCount: Int,
    modifier: Modifier = Modifier
) {
    val total = completedCount + pendingCount
    val completedAngle = if (total > 0) (completedCount.toFloat() / total) * 360f else 0f
    val pendingAngle = 360f - completedAngle

    Row(
        modifier = modifier
            .fillMaxWidth()
            .testTag("task_completion_chart"),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        Box(contentAlignment = Alignment.Center) {
            Canvas(modifier = Modifier.size(110.dp)) {
                val strokeWidth = 18.dp.toPx()
                val arcSize = Size(size.width - strokeWidth, size.height - strokeWidth)
                val topLeft = Offset(strokeWidth / 2f, strokeWidth / 2f)

                if (total == 0) {
                    drawArc(
                        color = Color(0xFFE2E8F0),
                        startAngle = 0f,
                        sweepAngle = 360f,
                        useCenter = false,
                        topLeft = topLeft,
                        size = arcSize,
                        style = Stroke(width = strokeWidth)
                    )
                } else {
                    // Pending Arc (Amber)
                    drawArc(
                        color = Color(0xFFF59E0B),
                        startAngle = -90f,
                        sweepAngle = pendingAngle,
                        useCenter = false,
                        topLeft = topLeft,
                        size = arcSize,
                        style = Stroke(width = strokeWidth)
                    )
                    // Completed Arc (Emerald)
                    drawArc(
                        color = Color(0xFF10B981),
                        startAngle = -90f + pendingAngle,
                        sweepAngle = completedAngle,
                        useCenter = false,
                        topLeft = topLeft,
                        size = arcSize,
                        style = Stroke(width = strokeWidth)
                    )
                }
            }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                val percent = if (total > 0) ((completedCount.toFloat() / total) * 100).toInt() else 0
                Text(
                    text = "$percent%",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "Done",
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(12.dp)
                        .background(Color(0xFF10B981), CircleShape)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Completed: $completedCount",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )
            }
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(12.dp)
                        .background(Color(0xFFF59E0B), CircleShape)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Pending: $pendingCount",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )
            }
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(12.dp)
                        .background(Color(0xFF64748B), CircleShape)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Total Tasks: $total",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun HistoricalTrendChart(
    records: List<PredictionRecord>,
    modifier: Modifier = Modifier
) {
    if (records.size < 2) {
        Text(
            text = "Generate multiple predictions to view workload trend over time.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(12.dp)
        )
        return
    }

    val displayRecords = records.take(7).reversed()
    val scores = displayRecords.map { it.workloadScore }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .testTag("historical_trend_chart")
    ) {
        Canvas(
            modifier = Modifier
                .fillMaxWidth()
                .height(130.dp)
                .padding(vertical = 12.dp, horizontal = 16.dp)
        ) {
            val width = size.width
            val height = size.height
            val stepX = width / (scores.size - 1)

            val points = scores.mapIndexed { index, score ->
                val x = index * stepX
                val y = height - (score / 100f * height)
                Offset(x, y)
            }

            // Draw guideline
            drawLine(
                color = Color(0xFFE2E8F0),
                start = Offset(0f, height * 0.5f),
                end = Offset(width, height * 0.5f),
                strokeWidth = 1.dp.toPx()
            )

            // Draw line graph
            for (i in 0 until points.size - 1) {
                drawLine(
                    color = Color(0xFF4F46E5),
                    start = points[i],
                    end = points[i + 1],
                    strokeWidth = 3.dp.toPx(),
                    cap = StrokeCap.Round
                )
            }

            // Draw dots
            points.forEachIndexed { i, pt ->
                drawCircle(
                    color = Color(0xFF4F46E5),
                    radius = 5.dp.toPx(),
                    center = pt
                )
                drawCircle(
                    color = Color.White,
                    radius = 2.5.dp.toPx(),
                    center = pt
                )
            }
        }

        // Date labels row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            displayRecords.forEach { rec ->
                Text(
                    text = "${rec.workloadScore}",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(rec.workloadLevel.colorHex)
                )
            }
        }
    }
}
