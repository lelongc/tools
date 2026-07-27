package com.example.data.repository

import android.content.Context
import android.content.SharedPreferences
import android.provider.Settings
import com.example.data.db.AppDatabase
import com.example.data.model.ActionEntity
import com.example.data.model.ActionStepEntity
import com.example.data.model.ActionWithSteps
import com.example.data.model.QuotaEntity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ActionRepository(private val context: Context) {
    private val db = AppDatabase.getDatabase(context)
    private val actionDao = db.actionDao()
    private val quotaDao = db.quotaDao()

    val deviceId: String by lazy {
        getOrCreateDeviceId()
    }

    val allActions: Flow<List<ActionWithSteps>> = actionDao.getAllActionsWithSteps()

    val currentQuota: Flow<QuotaEntity> = quotaDao.getQuotaFlow(deviceId).map { entity ->
        val currentMonth = getCurrentMonthString()
        if (entity == null) {
            val defaultQuota = QuotaEntity(
                deviceId = deviceId,
                isVip = false,
                vipExpireDateMs = 0L,
                monthlyRunsUsed = 0,
                lastResetMonth = currentMonth
            )
            quotaDao.insertOrUpdateQuota(defaultQuota)
            defaultQuota
        } else {
            // Check if month changed, reset monthly runs
            if (entity.lastResetMonth != currentMonth) {
                val resetQuota = entity.copy(
                    monthlyRunsUsed = 0,
                    lastResetMonth = currentMonth
                )
                quotaDao.insertOrUpdateQuota(resetQuota)
                resetQuota
            } else {
                // Check if VIP expired
                if (entity.isVip && entity.vipExpireDateMs > 0 && System.currentTimeMillis() > entity.vipExpireDateMs) {
                    val expiredQuota = entity.copy(isVip = false)
                    quotaDao.insertOrUpdateQuota(expiredQuota)
                    expiredQuota
                } else {
                    entity
                }
            }
        }
    }

    suspend fun getActionWithSteps(actionId: Int): ActionWithSteps? {
        return actionDao.getActionWithStepsById(actionId)
    }

    suspend fun saveAction(action: ActionEntity, steps: List<ActionStepEntity>): Long {
        return actionDao.saveFullAction(action, steps)
    }

    suspend fun deleteAction(actionId: Int) {
        actionDao.deleteAction(actionId)
    }

    suspend fun canCreateAction(): Boolean {
        val quota = quotaDao.getQuotaOnce(deviceId)
        if (quota?.isVip == true) return true
        val count = actionDao.getActionCount()
        return count < 1
    }

    suspend fun canExecuteAction(): Boolean {
        val quota = quotaDao.getQuotaOnce(deviceId) ?: return true
        if (quota.isVip) return true
        return quota.monthlyRunsUsed < 3
    }

    suspend fun recordActionRun(actionId: Int) {
        val quota = quotaDao.getQuotaOnce(deviceId)
        if (quota != null && !quota.isVip) {
            val updatedQuota = quota.copy(monthlyRunsUsed = quota.monthlyRunsUsed + 1)
            quotaDao.updateQuota(updatedQuota)
        }

        val actionWithSteps = actionDao.getActionWithStepsById(actionId)
        if (actionWithSteps != null) {
            val updatedAction = actionWithSteps.action.copy(
                runCount = actionWithSteps.action.runCount + 1
            )
            actionDao.updateAction(updatedAction)
        }
    }

    suspend fun activateVip(days: Int = 30): QuotaEntity {
        val currentQuota = quotaDao.getQuotaOnce(deviceId) ?: QuotaEntity(deviceId = deviceId)
        val newExpire = System.currentTimeMillis() + (days * 24 * 60 * 60 * 1000L)
        val vipQuota = currentQuota.copy(
            isVip = true,
            vipExpireDateMs = newExpire
        )
        quotaDao.insertOrUpdateQuota(vipQuota)
        return vipQuota
    }

    suspend fun resetVipToFree(): QuotaEntity {
        val currentQuota = quotaDao.getQuotaOnce(deviceId) ?: QuotaEntity(deviceId = deviceId)
        val freeQuota = currentQuota.copy(
            isVip = false,
            vipExpireDateMs = 0L,
            monthlyRunsUsed = 0
        )
        quotaDao.insertOrUpdateQuota(freeQuota)
        return freeQuota
    }

    private fun getOrCreateDeviceId(): String {
        val prefs: SharedPreferences = context.getSharedPreferences("autoaction_prefs", Context.MODE_PRIVATE)
        var savedId = prefs.getString("device_id", null)
        if (savedId.isNullOrBlank()) {
            val androidId = Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
            val cleanId = if (!androidId.isNullOrBlank() && androidId != "9774d56d682e549c") {
                androidId.takeLast(6).uppercase()
            } else {
                ((100000..999999).random()).toString()
            }
            savedId = "AA$cleanId"
            prefs.edit().putString("device_id", savedId).apply()
        }
        return savedId ?: "AA982312"
    }

    private fun getCurrentMonthString(): String {
        val sdf = SimpleDateFormat("yyyy-MM", Locale.US)
        return sdf.format(Date())
    }
}
