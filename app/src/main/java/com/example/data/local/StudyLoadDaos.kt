package com.example.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.PredictionRecord
import com.example.data.model.ScheduleSlot
import com.example.data.model.Subject
import com.example.data.model.Task
import com.example.data.model.UserProfile
import kotlinx.coroutines.flow.Flow

@Dao
interface UserProfileDao {
    @Query("SELECT * FROM user_profiles WHERE id = :userId LIMIT 1")
    fun getUserProfile(userId: String = "default_user"): Flow<UserProfile?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateProfile(profile: UserProfile)
}

@Dao
interface SubjectDao {
    @Query("SELECT * FROM subjects WHERE userId = :userId ORDER BY name ASC")
    fun getSubjects(userId: String = "default_user"): Flow<List<Subject>>

    @Query("SELECT * FROM subjects WHERE id = :id LIMIT 1")
    suspend fun getSubjectById(id: Long): Subject?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSubject(subject: Subject): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSubjects(subjects: List<Subject>)

    @Update
    suspend fun updateSubject(subject: Subject)

    @Delete
    suspend fun deleteSubject(subject: Subject)

    @Query("DELETE FROM subjects WHERE userId = :userId")
    suspend fun deleteAllSubjects(userId: String = "default_user")
}

@Dao
interface TaskDao {
    @Query("SELECT * FROM tasks WHERE userId = :userId ORDER BY isCompleted ASC, deadline ASC")
    fun getTasks(userId: String = "default_user"): Flow<List<Task>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTask(task: Task): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTasks(tasks: List<Task>)

    @Update
    suspend fun updateTask(task: Task)

    @Delete
    suspend fun deleteTask(task: Task)

    @Query("UPDATE tasks SET isCompleted = :completed WHERE id = :taskId")
    suspend fun setTaskCompleted(taskId: Long, completed: Boolean)

    @Query("DELETE FROM tasks WHERE userId = :userId")
    suspend fun deleteAllTasks(userId: String = "default_user")
}

@Dao
interface PredictionDao {
    @Query("SELECT * FROM predictions WHERE userId = :userId ORDER BY timestamp DESC")
    fun getPredictionHistory(userId: String = "default_user"): Flow<List<PredictionRecord>>

    @Query("SELECT * FROM predictions WHERE userId = :userId ORDER BY timestamp DESC LIMIT 1")
    fun getLatestPrediction(userId: String = "default_user"): Flow<PredictionRecord?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPrediction(prediction: PredictionRecord): Long

    @Query("DELETE FROM predictions WHERE userId = :userId")
    suspend fun deleteAllPredictions(userId: String = "default_user")
}

@Dao
interface ScheduleDao {
    @Query("SELECT * FROM study_schedules WHERE userId = :userId ORDER BY dayOfWeek ASC, startTime ASC")
    fun getSchedule(userId: String = "default_user"): Flow<List<ScheduleSlot>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSchedule(slots: List<ScheduleSlot>)

    @Query("DELETE FROM study_schedules WHERE userId = :userId")
    suspend fun clearSchedule(userId: String = "default_user")
}
