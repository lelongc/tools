package com.example.data.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import androidx.room.Update
import com.example.data.model.ActionEntity
import com.example.data.model.ActionStepEntity
import com.example.data.model.ActionWithSteps
import kotlinx.coroutines.flow.Flow

@Dao
interface ActionDao {
    @Transaction
    @Query("SELECT * FROM actions ORDER BY createdAt DESC")
    fun getAllActionsWithSteps(): Flow<List<ActionWithSteps>>

    @Transaction
    @Query("SELECT * FROM actions WHERE id = :actionId")
    suspend fun getActionWithStepsById(actionId: Int): ActionWithSteps?

    @Query("SELECT COUNT(*) FROM actions")
    suspend fun getActionCount(): Int

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAction(action: ActionEntity): Long

    @Update
    suspend fun updateAction(action: ActionEntity)

    @Query("DELETE FROM actions WHERE id = :actionId")
    suspend fun deleteAction(actionId: Int)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSteps(steps: List<ActionStepEntity>)

    @Query("DELETE FROM action_steps WHERE actionId = :actionId")
    suspend fun deleteStepsByActionId(actionId: Int)

    @Transaction
    suspend fun saveFullAction(action: ActionEntity, steps: List<ActionStepEntity>): Long {
        val actionId = if (action.id == 0) {
            insertAction(action)
        } else {
            updateAction(action)
            action.id.toLong()
        }
        deleteStepsByActionId(actionId.toInt())
        val updatedSteps = steps.mapIndexed { index, step ->
            step.copy(actionId = actionId.toInt(), stepOrder = index + 1)
        }
        insertSteps(updatedSteps)
        return actionId
    }
}
