package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.ui.navigation.Screen
import com.example.ui.screens.AboutScreen
import com.example.ui.screens.DashboardScreen
import com.example.ui.screens.HistoryScreen
import com.example.ui.screens.InputScreen
import com.example.ui.screens.LandingScreen
import com.example.ui.screens.PredictionScreen
import com.example.ui.screens.ProfileScreen
import com.example.ui.screens.ScheduleScreen
import com.example.ui.screens.SubjectsScreen
import com.example.ui.screens.TasksScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.viewmodel.StudyLoadViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: StudyLoadViewModel by viewModels()

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            MyApplicationTheme {
                val profile by viewModel.userProfile.collectAsStateWithLifecycle()
                val subjects by viewModel.subjects.collectAsStateWithLifecycle()
                val tasks by viewModel.tasks.collectAsStateWithLifecycle()
                val prediction by viewModel.currentPrediction.collectAsStateWithLifecycle()
                val whatIfState by viewModel.whatIfState.collectAsStateWithLifecycle()
                val aiRecommendation by viewModel.aiRecommendation.collectAsStateWithLifecycle()
                val isLoadingAi by viewModel.isLoadingAi.collectAsStateWithLifecycle()
                val predictionHistory by viewModel.predictionHistory.collectAsStateWithLifecycle()
                val schedule by viewModel.studySchedule.collectAsStateWithLifecycle()
                val statusMessage by viewModel.statusMessage.collectAsStateWithLifecycle()

                val snackbarHostState = remember { SnackbarHostState() }
                var currentScreen by remember { mutableStateOf<Screen>(Screen.Landing) }

                LaunchedEffect(statusMessage) {
                    statusMessage?.let { msg ->
                        snackbarHostState.showSnackbar(msg)
                        viewModel.dismissStatusMessage()
                    }
                }

                // Handle system back navigation smoothly
                BackHandler(enabled = currentScreen != Screen.Dashboard && currentScreen != Screen.Landing) {
                    currentScreen = Screen.Dashboard
                }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    snackbarHost = { SnackbarHost(snackbarHostState) },
                    topBar = {
                        if (currentScreen != Screen.Landing) {
                            TopAppBar(
                                title = {
                                    Text(
                                        text = "StudyLoad AI",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 18.sp
                                    )
                                },
                                actions = {
                                    IconButton(
                                        onClick = { viewModel.loadDemoData() },
                                        modifier = Modifier.testTag("topbar_load_demo")
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.PlayArrow,
                                            contentDescription = "Load Demo Data",
                                            tint = Color(0xFF4F46E5)
                                        )
                                    }
                                    IconButton(
                                        onClick = { currentScreen = Screen.About },
                                        modifier = Modifier.testTag("topbar_about")
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Info,
                                            contentDescription = "About",
                                            tint = MaterialTheme.colorScheme.onSurface
                                        )
                                    }
                                    IconButton(
                                        onClick = { currentScreen = Screen.Profile },
                                        modifier = Modifier.testTag("topbar_profile")
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Person,
                                            contentDescription = "Profile",
                                            tint = MaterialTheme.colorScheme.onSurface
                                        )
                                    }
                                },
                                colors = TopAppBarDefaults.topAppBarColors(
                                    containerColor = MaterialTheme.colorScheme.surface
                                )
                            )
                        }
                    },
                    bottomBar = {
                        if (currentScreen != Screen.Landing) {
                            NavigationBar(
                                containerColor = MaterialTheme.colorScheme.surface,
                                modifier = Modifier.testTag("bottom_nav_bar")
                            ) {
                                Screen.bottomNavScreens.forEach { screen ->
                                    val isSelected = currentScreen == screen
                                    NavigationBarItem(
                                        selected = isSelected,
                                        onClick = { currentScreen = screen },
                                        icon = {
                                            Icon(
                                                imageVector = screen.icon,
                                                contentDescription = screen.title
                                            )
                                        },
                                        label = {
                                            Text(
                                                text = screen.title,
                                                fontSize = 10.sp,
                                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                            )
                                        },
                                        modifier = Modifier.testTag("nav_item_${screen.route}")
                                    )
                                }
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        when (currentScreen) {
                            Screen.Landing -> LandingScreen(
                                onNavigateToDashboard = { currentScreen = Screen.Dashboard },
                                onNavigateToInput = { currentScreen = Screen.Input },
                                onLoadDemoData = {
                                    viewModel.loadDemoData()
                                    currentScreen = Screen.Dashboard
                                }
                            )

                            Screen.Dashboard -> DashboardScreen(
                                profile = profile,
                                subjects = subjects,
                                tasks = tasks,
                                prediction = prediction,
                                onNavigateToInput = { currentScreen = Screen.Input },
                                onNavigateToPrediction = { currentScreen = Screen.Prediction },
                                onNavigateToSchedule = { currentScreen = Screen.Schedule },
                                onLoadDemoData = { viewModel.loadDemoData() }
                            )

                            Screen.Input -> InputScreen(
                                profile = profile,
                                onSaveProfile = { name, course, sem, hours, start ->
                                    viewModel.updateUserProfile(name, course, sem, hours, start)
                                },
                                onAddSubject = { name, code, diff, total, comp, exam, prep, notes ->
                                    viewModel.addSubject(name, code, diff, total, comp, exam, prep, notes)
                                },
                                onNavigateToPrediction = { currentScreen = Screen.Prediction }
                            )

                            Screen.Prediction -> PredictionScreen(
                                prediction = prediction,
                                subjects = subjects,
                                whatIfState = whatIfState,
                                aiRecommendation = aiRecommendation,
                                isLoadingAi = isLoadingAi,
                                onSavePredictionSnapshot = { viewModel.saveCurrentPredictionSnapshot() },
                                onUpdateWhatIf = { hoursDelta, chDelta, assignDelta, examDelta ->
                                    viewModel.updateWhatIfSliders(hoursDelta, chDelta, assignDelta, examDelta)
                                },
                                onRefreshAi = { viewModel.refreshAiRecommendation() },
                                onNavigateToInput = { currentScreen = Screen.Input }
                            )

                            Screen.Schedule -> ScheduleScreen(
                                schedule = schedule,
                                subjects = subjects,
                                onRegenerateSchedule = { viewModel.regenerateSchedule() },
                                onNavigateToInput = { currentScreen = Screen.Input }
                            )

                            Screen.Tasks -> TasksScreen(
                                tasks = tasks,
                                subjects = subjects,
                                onAddTask = { title, sub, type, deadline, pri, hrs, notes ->
                                    viewModel.addTask(title, sub, type, deadline, pri, hrs, notes)
                                },
                                onToggleCompleted = { task -> viewModel.toggleTaskCompleted(task) },
                                onDeleteTask = { task -> viewModel.deleteTask(task) }
                            )

                            Screen.Subjects -> SubjectsScreen(
                                subjects = subjects,
                                onAddSubject = { currentScreen = Screen.Input },
                                onDeleteSubject = { subject -> viewModel.deleteSubject(subject) },
                                onUpdateSubject = { subject -> viewModel.updateSubject(subject) }
                            )

                            Screen.History -> HistoryScreen(
                                records = predictionHistory,
                                onNavigateToPrediction = { currentScreen = Screen.Prediction }
                            )

                            Screen.About -> AboutScreen()

                            Screen.Profile -> ProfileScreen(
                                profile = profile,
                                onUpdateProfile = { name, course, sem, hours, start ->
                                    viewModel.updateUserProfile(name, course, sem, hours, start)
                                },
                                onLoadDemoData = { viewModel.loadDemoData() },
                                onClearAllData = { viewModel.clearAllData() }
                            )
                        }
                    }
                }
            }
        }
    }
}
