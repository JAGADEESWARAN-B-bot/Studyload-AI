# StudyLoad AI – Intelligent Study Workload Prediction System

An AI-assisted study workload prediction, schedule planning, and what-if simulation system for college students built with **Kotlin, Jetpack Compose, Room SQLite Database, and Google Gemini AI**.

---

## 🎯 Project Objective
College students frequently face academic burnout, cramming, and schedule congestion due to poor visibility into their true upcoming study workload. **StudyLoad AI** analyzes enrolled courses, chapter backlogs, assignment deadlines, upcoming exams, and available daily study hours to:
1. Calculate an **explainable, deterministic workload score (0–100)**.
2. Classify workload as **LOW**, **MODERATE**, **HIGH**, or **VERY HIGH**.
3. Identify critical **risk factors** (e.g. deadline congestion, capacity deficit, low exam readiness).
4. Provide an interactive **What-If Study Simulator** to model changes before stress peaks.
5. Generate an **automated weekly study timetable** strictly adhering to available hours.
6. Provide **personalized AI study coaching** powered by Gemini (`gemini-3.5-flash`) with an offline local fallback engine.

---

## 🌟 Key Features

### 1. Deterministic Workload Prediction Engine
Calculates true academic demand using:
- **Chapter Backlog Load**: $\text{Pending Chapters} \times \text{Difficulty Weight}$ (Easy: 1.0, Medium: 1.5, Hard: 2.2, Very Hard: 3.0)
- **Assignment Urgency**: Weighted by proximity (Deadlines $\le 2$ days get $2.2\times$ multiplier)
- **Exam Readiness Penalty**: $(100 - \text{Exam Prep \%}) \times \text{Exam Proximity}$
- **Capacity Utilization**: $\frac{\text{Required Weekly Study Hours}}{\text{Available Weekly Study Hours}}$
- **Classification**:
  - `0 – 24`: **LOW** (Sustainable progress)
  - `25 – 49`: **MODERATE** (Balanced pacing)
  - `50 – 74`: **HIGH** (Priority adjustments required)
  - `75 – 100`: **VERY HIGH** (Capacity deficit / Burnout risk)

### 2. Interactive "What-If" Study Simulator
Students can simulate scenarios in real time using interactive sliders:
- Adjust daily study hours ($-2\text{h}$ to $+4\text{h}$)
- Fast-track chapter completion ($+0$ to $+8$ chapters)
- Finish pending assignments
- Boost exam readiness percentage
- **Immediate recalculation** of the score delta, new workload level, and capacity reduction.

### 3. Automated Weekly Timetable
- Dynamically schedules study blocks (Monday through Sunday) with 15-minute breaks.
- Allocates time based on subject difficulty and impending deadlines.
- Never exceeds the student's daily available study hours.

### 4. Dual-Tier AI Study Recommendations
- **Primary Tier**: Google Gemini (`gemini-3.5-flash`) via secure REST API requesting prioritized action steps, subject attention allocation, and study technique tips.
- **Offline Local Fallback**: Zero-dependency deterministic recommendation generator guaranteeing that the application never crashes if the API key is missing or the device is offline.

### 5. Task & Assignment Management
- Add, edit, delete, and toggle tasks.
- Filters: All, Pending, Completed, High Priority.
- Track deadline dates and estimated completion hours.

### 6. Subject Curriculum Management
- Track total vs. completed chapters with dynamic progress bars.
- Set subject difficulty and target exam dates.
- Real-time subject-level workload breakdown.

### 7. Historical Trend Tracking
- Automatically records prediction snapshots with timestamps.
- Custom Canvas chart visualizes workload trends over time.

### 8. One-Tap Demo Data Seeder
- Pre-loaded with 5 realistic college courses:
  - *Artificial Intelligence* (Hard, 12 ch, Exam in 7 days)
  - *Database Management* (Medium, 10 ch, Assignment in 4 days)
  - *Data Structures* (Hard, 14 ch, Exam in 12 days)
  - *Computer Networks* (Medium, 9 ch)
  - *Software Engineering* (Easy, 8 ch)

---

## 🛠️ Technology Stack
- **Platform**: Android (Min SDK 24, Target SDK 36)
- **Language**: Kotlin 2.2+
- **UI Framework**: Jetpack Compose (Material Design 3)
- **Local Database**: Room Persistence Library (KSP-compiled SQLite)
- **Concurrency & State**: Kotlin Coroutines, StateFlow, ViewModel
- **Networking**: OkHttp 4, Retrofit 2
- **AI Integration**: Google Gemini 3.5 Flash REST API + Offline Local Heuristic Engine
- **Secret Management**: Google Secrets Gradle Plugin + `.env` / `BuildConfig`

---

## 📂 Project Architecture

```
com.example/
├── data/
│   ├── model/
│   │   ├── UserProfile.kt        # Student profile entity
│   │   ├── Subject.kt            # Subject & difficulty entity
│   │   ├── Task.kt               # Task, priority, & type entity
│   │   ├── PredictionResult.kt   # Workload level & prediction records
│   │   └── ScheduleItem.kt       # Timetable slots entity
│   ├── local/
│   │   ├── AppDatabase.kt        # Room database builder
│   │   └── StudyLoadDaos.kt      # Reactive Flow DAOs
│   ├── engine/
│   │   ├── WorkloadCalculator.kt # Deterministic prediction & What-If engine
│   │   ├── ScheduleGenerator.kt  # Weekly timetable generator
│   │   └── RecommendationEngine.kt# Gemini API client & local fallback
│   └── repository/
│       └── StudyRepository.kt    # Repository & demo data seeder
├── ui/
│   ├── components/
│   │   ├── WorkloadGauge.kt      # Canvas speedometer gauge
│   │   ├── Charts.kt             # Subject bar & task donut charts
│   │   └── CommonCards.kt        # Metric cards & risk badges
│   ├── navigation/
│   │   └── Screen.kt             # Navigation routes
│   ├── screens/
│   │   ├── LandingScreen.kt      # Onboarding & product overview
│   │   ├── DashboardScreen.kt    # Workload summary & charts
│   │   ├── InputScreen.kt        # Validated workload input form
│   │   ├── PredictionScreen.kt   # What-If simulator & AI advice
│   │   ├── ScheduleScreen.kt     # Weekly timetable
│   │   ├── TasksScreen.kt        # Task manager & filters
│   │   ├── SubjectsScreen.kt     # Subject curriculum list
│   │   ├── HistoryScreen.kt      # Prediction history & trend line
│   │   ├── AboutScreen.kt        # Formulas & academic methodology
│   │   └── ProfileScreen.kt      # Student profile & data reset
│   ├── theme/
│   │   ├── Color.kt              # Academic indigo & sky palette
│   │   ├── Theme.kt              # Material 3 light/dark schemes
│   │   └── Type.kt               # Typography system
│   └── viewmodel/
│       └── StudyLoadViewModel.kt # Central state coordinator
└── MainActivity.kt               # Edge-to-edge root activity
```

---

## 🧪 Testing & Verification
Unit tests are implemented in `app/src/test/java/com/example/ExampleUnitTest.kt` and `ExampleRobolectricTest.kt`:
1. Empty subjects workload baseline test.
2. High-difficulty chapter backlog & deadline congestion scoring test.
3. What-If simulator score drop & delta test.
4. Robolectric string resource & application launch verification.

Run tests using:
```bash
gradle :app:testDebugUnitTest
```
