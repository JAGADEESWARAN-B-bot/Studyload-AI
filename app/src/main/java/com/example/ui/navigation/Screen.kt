package com.example.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Analytics
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.EditCalendar
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Person
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Landing : Screen("landing", "Home", Icons.Default.Home)
    object Dashboard : Screen("dashboard", "Dashboard", Icons.Default.Dashboard)
    object Input : Screen("input", "Input", Icons.Default.EditCalendar)
    object Prediction : Screen("prediction", "Prediction", Icons.Default.Analytics)
    object Schedule : Screen("schedule", "Schedule", Icons.Default.CalendarMonth)
    object Tasks : Screen("tasks", "Tasks", Icons.Default.Assignment)
    object Subjects : Screen("subjects", "Subjects", Icons.Default.Book)
    object History : Screen("history", "History", Icons.Default.History)
    object About : Screen("about", "About", Icons.Default.Info)
    object Profile : Screen("profile", "Profile", Icons.Default.Person)

    companion object {
        val bottomNavScreens = listOf(
            Dashboard,
            Prediction,
            Schedule,
            Tasks,
            Subjects
        )
    }
}
