package com.example.data.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.QuotaEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface QuotaDao {
    @Query("SELECT * FROM quotas WHERE deviceId = :deviceId")
    fun getQuotaFlow(deviceId: String): Flow<QuotaEntity?>

    @Query("SELECT * FROM quotas WHERE deviceId = :deviceId")
    suspend fun getQuotaOnce(deviceId: String): QuotaEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateQuota(quota: QuotaEntity)

    @Update
    suspend fun updateQuota(quota: QuotaEntity)
}
