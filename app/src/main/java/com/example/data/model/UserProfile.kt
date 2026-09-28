package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "user_profiles")
data class UserProfile(
    @PrimaryKey val id: String = "default_user",
    val studentName: String = "Alex Rivera",
    val course: String = "B.S. Computer Science",
    val semester: String = "Semester 5",
    val dailyAvailableHours: Float = 4.0f,
    val preferredStudyStartTime: String = "17:00",
    val email: String = "alex.rivera@university.edu",
    val isLoggedIn: Boolean = true
)
