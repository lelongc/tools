package com.example.ui.viewmodel

import android.app.Application
import android.widget.Toast
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.model.ActionEntity
import com.example.data.model.ActionStepEntity
import com.example.data.model.ActionWithSteps
import com.example.data.model.QuotaEntity
import com.example.data.repository.ActionRepository
import com.example.service.AutoActionAccessibilityService
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class UiEvent {
    data class ShowToast(val message: String) : UiEvent()
    data class ShowPaywall(val reason: String) : UiEvent()
}

class AutoActionViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = ActionRepository(application)

    val deviceId: String = repository.deviceId

    val allActions: StateFlow<List<ActionWithSteps>> = repository.allActions
        .stateInScope(emptyList())

    val currentQuota: StateFlow<QuotaEntity?> = repository.currentQuota
        .stateInScope(null)

    private val _selectedAction = MutableStateFlow<ActionWithSteps?>(null)
    val selectedAction: StateFlow<ActionWithSteps?> = _selectedAction.asStateFlow()

    private val _isExecuting = MutableStateFlow(false)
    val isExecuting: StateFlow<Boolean> = _isExecuting.asStateFlow()

    private val _executionStepProgress = MutableStateFlow(Pair(0, 0))
    val executionStepProgress: StateFlow<Pair<Int, Int>> = _executionStepProgress.asStateFlow()

    private val _showPaywall = MutableStateFlow(false)
    val showPaywall: StateFlow<Boolean> = _showPaywall.asStateFlow()

    private val _paywallReason = MutableStateFlow("")
    val paywallReason: StateFlow<String> = _paywallReason.asStateFlow()

    private val _eventFlow = MutableSharedFlow<UiEvent>()
    val eventFlow: SharedFlow<UiEvent> = _eventFlow.asSharedFlow()

    private val _inAppOverlayActive = MutableStateFlow(true)
    val inAppOverlayActive: StateFlow<Boolean> = _inAppOverlayActive.asStateFlow()

    init {
        // Pre-populate sample default action ONCE on first launch
        viewModelScope.launch {
            val prefs = getApplication<Application>().getSharedPreferences("auto_action_prefs", android.content.Context.MODE_PRIVATE)
            val isFirstLaunch = prefs.getBoolean("is_first_launch", true)
            if (isFirstLaunch) {
                prefs.edit().putBoolean("is_first_launch", false).apply()
                createDefaultSampleAction()
            }
        }
    }

    fun toggleInAppOverlay(enabled: Boolean) {
        _inAppOverlayActive.value = enabled
    }

    fun selectAction(actionWithSteps: ActionWithSteps?) {
        _selectedAction.value = actionWithSteps
    }

    fun hidePaywall() {
        _showPaywall.value = false
    }

    fun triggerPaywall(reason: String) {
        _paywallReason.value = reason
        _showPaywall.value = true
        viewModelScope.launch {
            _eventFlow.emit(UiEvent.ShowPaywall(reason))
        }
    }

    fun saveAction(
        actionId: Int = 0,
        name: String,
        isScheduled: Boolean = false,
        hour: Int = 8,
        minute: Int = 0,
        repeatDays: String = "MON,TUE,WED,THU,FRI,SAT,SUN",
        steps: List<ActionStepEntity>,
        onSuccess: () -> Unit = {}
    ) {
        viewModelScope.launch {
            if (actionId == 0) {
                val canCreate = repository.canCreateAction()
                if (!canCreate) {
                    triggerPaywall("Gói Miễn Phí chỉ tạo tối đa 1 hành động. Nâng cấp VIP 99k để tạo KHÔNG GIỚI HẠN!")
                    return@launch
                }
            }

            if (isScheduled) {
                val quota = currentQuota.value
                if (quota?.isVip != true) {
                    // Check scheduled count
                    val scheduledCount = allActions.value.count { it.action.isScheduled && it.action.id != actionId }
                    if (scheduledCount >= 1) {
                        triggerPaywall("Gói Miễn Phí chỉ được lên lịch tối đa 1 lịch/tháng. Nâng cấp VIP 99k để lên lịch tự động KHÔNG GIỚI HẠN!")
                        return@launch
                    }
                }
            }

            val actionEntity = ActionEntity(
                id = actionId,
                name = name.ifBlank { "Hành động tự động" },
                isScheduled = isScheduled,
                scheduleHour = hour,
                scheduleMinute = minute,
                repeatDays = repeatDays
            )

            repository.saveAction(actionEntity, steps)
            _eventFlow.emit(UiEvent.ShowToast("Đã lưu hành động thành công!"))
            onSuccess()
        }
    }

    fun deleteAction(actionId: Int) {
        viewModelScope.launch {
            repository.deleteAction(actionId)
            _eventFlow.emit(UiEvent.ShowToast("Đã xoá hành động"))
        }
    }

    fun runAction(actionWithSteps: ActionWithSteps) {
        viewModelScope.launch {
            val canExecute = repository.canExecuteAction()
            if (!canExecute) {
                triggerPaywall("Bạn đã dùng hết 3 lượt chạy miễn phí tháng này! Nâng cấp VIP 99k/tháng để sử dụng KHÔNG GIỚI HẠN.")
                return@launch
            }

            val service = AutoActionAccessibilityService.instance
            if (service == null) {
                _eventFlow.emit(UiEvent.ShowToast("Vui lòng bật Dịch vụ Hỗ trợ Tiếp cận (Accessibility) trong Cài đặt để chạy thao tác!"))
                return@launch
            }

            if (actionWithSteps.steps.isEmpty()) {
                _eventFlow.emit(UiEvent.ShowToast("Hành động này chưa có bước thao tác nào!"))
                return@launch
            }

            _isExecuting.value = true
            service.executeGestureSequence(
                steps = actionWithSteps.steps,
                onProgress = { current, total ->
                    _executionStepProgress.value = Pair(current, total)
                },
                onComplete = { success ->
                    _isExecuting.value = false
                    if (success) {
                        viewModelScope.launch {
                            repository.recordActionRun(actionWithSteps.action.id)
                            _eventFlow.emit(UiEvent.ShowToast("Chạy hoàn tất thành công!"))
                        }
                    } else {
                        viewModelScope.launch {
                            _eventFlow.emit(UiEvent.ShowToast("Có lỗi xảy ra khi thực hiện thao tác"))
                        }
                    }
                }
            )
        }
    }

    fun stopExecution() {
        AutoActionAccessibilityService.instance?.stopExecution()
        _isExecuting.value = false
    }

    fun simulateSmsBankingWebhook(smsContent: String): Boolean {
        // SMS content parser simulation for VietQR MBBank auto approval:
        // Format e.g.: "MBBank: SD +99,000VND vao TK 0123456789. ND: VIP AA982312"
        val uppercaseContent = smsContent.uppercase()
        val deviceTag = "VIP $deviceId"

        val hasDeviceMatch = uppercaseContent.contains(deviceTag) || uppercaseContent.contains(deviceId)
        val hasAmountMatch = uppercaseContent.contains("99") || uppercaseContent.contains("99000") || uppercaseContent.contains("99,000")

        if (hasDeviceMatch && hasAmountMatch) {
            viewModelScope.launch {
                repository.activateVip(30)
                _showPaywall.value = false
                _eventFlow.emit(UiEvent.ShowToast("🎉 XÁC NHẬN CHUYỂN KHOẢN THÀNH CÔNG! ĐÃ KÍCH HOẠT VIP 30 NGÀY!"))
            }
            return true
        } else {
            viewModelScope.launch {
                _eventFlow.emit(UiEvent.ShowToast("Cú pháp SMS không hợp lệ hoặc thiếu mã thiết bị $deviceId"))
            }
            return false
        }
    }

    fun activateVipByPassCode(code: String): Boolean {
        if (code.trim().uppercase() == "VIPPRO99K" || code.trim().uppercase() == "AUTOTOUCH99K") {
            viewModelScope.launch {
                repository.activateVip(30)
                _showPaywall.value = false
                _eventFlow.emit(UiEvent.ShowToast("🎉 ĐÃ KÍCH HOẠT THÀNH CÔNG VIP 30 NGÀY!"))
            }
            return true
        }
        return false
    }

    fun resetToFreeAccount() {
        viewModelScope.launch {
            repository.resetVipToFree()
            _eventFlow.emit(UiEvent.ShowToast("Đã chuyển về tài khoản Miễn phí"))
        }
    }

    private suspend fun createDefaultSampleAction() {
        val sampleAction = ActionEntity(
            name = "Thao tác Điểm danh mẫu (Chạm & Vuốt)",
            isScheduled = false
        )
        val sampleSteps = listOf(
            ActionStepEntity(
                actionId = 0,
                stepOrder = 1,
                type = "TAP",
                x = 540,
                y = 1200,
                durationMs = 150,
                delayAfterMs = 1000
            ),
            ActionStepEntity(
                actionId = 0,
                stepOrder = 2,
                type = "SWIPE",
                x = 540,
                y = 1500,
                endX = 540,
                endY = 600,
                durationMs = 400,
                delayAfterMs = 1500
            ),
            ActionStepEntity(
                actionId = 0,
                stepOrder = 3,
                type = "TAP",
                x = 800,
                y = 450,
                durationMs = 200,
                delayAfterMs = 800
            )
        )
        repository.saveAction(sampleAction, sampleSteps)
    }

    private fun <T> kotlinx.coroutines.flow.Flow<T>.stateInScope(initialValue: T): StateFlow<T> {
        val flowState = MutableStateFlow(initialValue)
        viewModelScope.launch {
            this@stateInScope.collect {
                flowState.value = it
            }
        }
        return flowState.asStateFlow()
    }
}
