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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.WorkloadLevel
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun WorkloadGauge(
    score: Int,
    level: WorkloadLevel,
    modifier: Modifier = Modifier
) {
    val animatedScore = remember { Animatable(0f) }

    LaunchedEffect(score) {
        animatedScore.animateTo(
            targetValue = score.toFloat().coerceIn(0f, 100f),
            animationSpec = tween(durationMillis = 1000, easing = FastOutSlowInEasing)
        )
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .testTag("workload_gauge_container"),
        contentAlignment = Alignment.Center
    ) {
        Canvas(
            modifier = Modifier
                .size(240.dp, 150.dp)
                .testTag("workload_gauge_canvas")
        ) {
            val canvasWidth = size.width
            val canvasHeight = size.height
            val strokeWidth = 22.dp.toPx()
            val arcSize = Size(canvasWidth - strokeWidth, (canvasHeight * 2f) - strokeWidth)
            val arcOffset = Offset(strokeWidth / 2f, strokeWidth / 2f)

            // Start angle 180° (left), sweep 180° (to right)
            val startAngle = 180f
            val totalSweep = 180f

            // Background Track
            drawArc(
                color = Color(0xFFE2E8F0),
                startAngle = startAngle,
                sweepAngle = totalSweep,
                useCenter = false,
                topLeft = arcOffset,
                size = arcSize,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )

            // Active Progress Gradient Arc
            val progressFraction = (animatedScore.value / 100f).coerceIn(0f, 1f)
            val progressSweep = totalSweep * progressFraction

            if (progressSweep > 0f) {
                val gradient = Brush.horizontalGradient(
                    colors = listOf(
                        Color(0xFF10B981), // Emerald
                        Color(0xFF0284C7), // Blue
                        Color(0xFFF59E0B), // Amber
                        Color(0xFFEF4444)  // Crimson
                    )
                )

                drawArc(
                    brush = gradient,
                    startAngle = startAngle,
                    sweepAngle = progressSweep,
                    useCenter = false,
                    topLeft = arcOffset,
                    size = arcSize,
                    style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
                )
            }

            // Pointer Needle & Pivot
            val angleRad = (startAngle + progressSweep) * (PI.toFloat() / 180f)
            val centerX = canvasWidth / 2f
            val centerY = canvasHeight
            val needleLength = (canvasWidth / 2f) - strokeWidth - 10.dp.toPx()
            val needleEnd = Offset(
                x = centerX + needleLength * cos(angleRad),
                y = centerY + needleLength * sin(angleRad)
            )

            drawLine(
                color = Color(level.colorHex),
                start = Offset(centerX, centerY),
                end = needleEnd,
                strokeWidth = 4.dp.toPx(),
                cap = StrokeCap.Round
            )

            drawCircle(
                color = Color(level.colorHex),
                radius = 8.dp.toPx(),
                center = Offset(centerX, centerY)
            )
            drawCircle(
                color = Color.White,
                radius = 4.dp.toPx(),
                center = Offset(centerX, centerY)
            )
        }

        // Center Content Overlay
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(top = 50.dp)
        ) {
            Text(
                text = "${animatedScore.value.toInt()}",
                fontSize = 42.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color(level.colorHex)
            )
            Text(
                text = "out of 100",
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(6.dp))
            Box(
                modifier = Modifier
                    .background(
                        color = Color(level.badgeBgHex),
                        shape = RoundedCornerShape(12.dp)
                    )
                    .padding(horizontal = 14.dp, vertical = 4.dp)
            ) {
                Text(
                    text = level.label,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = Color(level.colorHex)
                )
            }
        }
    }
}
