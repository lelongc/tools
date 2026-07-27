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
        val vipQuota = QuotaEntity(
            deviceId = deviceId,
            isVip = true,
            vipExpireDateMs = Long.MAX_VALUE,
            monthlyRunsUsed = 0,
            lastResetMonth = currentMonth
        )
        if (entity == null || !entity.isVip) {
            quotaDao.insertOrUpdateQuota(vipQuota)
        }
        vipQuota
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
        return true
    }

    suspend fun canExecuteAction(): Boolean {
        return true
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
            isVip = true,
            vipExpireDateMs = Long.MAX_VALUE,
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
