package com.example.data.model

import androidx.room.Embedded
import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.Relation

enum class StepType {
    TAP,
    SWIPE,
    LONG_PRESS
}

@Entity(tableName = "actions")
data class ActionEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val createdAt: Long = System.currentTimeMillis(),
    val isScheduled: Boolean = false,
    val scheduleHour: Int = 8,
    val scheduleMinute: Int = 0,
    val repeatDays: String = "MON,TUE,WED,THU,FRI,SAT,SUN", // Comma-separated
    val runCount: Int = 0
)

@Entity(tableName = "action_steps")
data class ActionStepEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val actionId: Int,
    val stepOrder: Int,
    val type: String, // "TAP", "SWIPE", "LONG_PRESS", "PASTE_TEXT", "COPY_TEXT", "SCREENSHOT"
    val x: Int,
    val y: Int,
    val endX: Int = 0,
    val endY: Int = 0,
    val durationMs: Long = 300L,
    val delayAfterMs: Long = 1000L,
    val textPayload: String = ""
)

data class ActionWithSteps(
    @Embedded val action: ActionEntity,
    @Relation(
        parentColumn = "id",
        entityColumn = "actionId"
    )
    val steps: List<ActionStepEntity>
)

@Entity(tableName = "quotas")
data class QuotaEntity(
    @PrimaryKey val deviceId: String,
    val isVip: Boolean = true,
    val vipExpireDateMs: Long = Long.MAX_VALUE,
    val monthlyRunsUsed: Int = 0,
    val lastResetMonth: String = "" // "2026-07"
)
