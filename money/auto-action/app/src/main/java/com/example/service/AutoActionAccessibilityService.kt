package com.example.service

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.graphics.Path
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import com.example.data.model.ActionStepEntity
import kotlinx.coroutines.CancellableContinuation
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine

class AutoActionAccessibilityService : AccessibilityService() {

    // Instance-scoped coroutine scope — cancelled properly on destroy
    private val serviceScope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private var executionJob: Job? = null

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
        _isConnected.value = true
        Log.d(TAG, "Accessibility Service Connected!")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        if (FloatingOverlayService.isLiveRecordingActive()) {
            val eventType = event.eventType
            if (eventType == AccessibilityEvent.TYPE_VIEW_CLICKED || eventType == AccessibilityEvent.TYPE_VIEW_LONG_CLICKED) {
                val node = event.source ?: rootInActiveWindow
                node?.let {
                    val rect = android.graphics.Rect()
                    it.getBoundsInScreen(rect)
                    val clickX = rect.centerX()
                    val clickY = rect.centerY()
                    if (clickX > 0 && clickY > 0) {
                        FloatingOverlayService.recordExternalTap(clickX, clickY)
                    }
                }
            }
        }
    }

    override fun onInterrupt() {
        _isConnected.value = false
        Log.d(TAG, "Accessibility Service Interrupted")
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
        executionJob?.cancel()
        if (instance == this) {
            instance = null
            _isConnected.value = false
        }
    }

    // ──────────────────────────────────────────────
    // Public API: Execute a full sequence of recorded steps
    // ──────────────────────────────────────────────

    fun executeGestureSequence(
        steps: List<ActionStepEntity>,
        onProgress: (currentIndex: Int, total: Int) -> Unit = { _, _ -> },
        onComplete: (success: Boolean) -> Unit = {}
    ) {
        if (steps.isEmpty()) {
            onComplete(true)
            return
        }

        executionJob?.cancel()
        _isExecuting.value = true

        executionJob = serviceScope.launch {
            try {
                steps.forEachIndexed { index, step ->
                    if (!_isExecuting.value) return@launch
                    onProgress(index + 1, steps.size)

                    when (step.type) {
                        "TAP" -> performTap(step.x, step.y, step.durationMs)
                        "LONG_PRESS" -> performTap(step.x, step.y, step.durationMs.coerceAtLeast(1000L))
                        "SWIPE" -> performSwipe(
                            step.x, step.y,
                            step.endX, step.endY,
                            step.durationMs.coerceAtLeast(200L)
                        )
                        "PASTE_TEXT" -> performPasteText(step.x, step.y, step.textPayload)
                        "COPY_TEXT" -> performCopyText(step.x, step.y)
                        "SCREENSHOT" -> performTakeScreenshot()
                        "GLOBAL_BACK" -> performGlobalAction(GLOBAL_ACTION_BACK)
                        "GLOBAL_HOME" -> performGlobalAction(GLOBAL_ACTION_HOME)
                        "GLOBAL_RECENTS" -> performGlobalAction(GLOBAL_ACTION_RECENTS)
                    }

                    if (step.delayAfterMs > 0) {
                        delay(step.delayAfterMs)
                    }
                }
                _isExecuting.value = false
                onComplete(true)
            } catch (e: Exception) {
                Log.e(TAG, "Error executing gesture sequence", e)
                _isExecuting.value = false
                onComplete(false)
            }
        }
    }

    fun stopExecution() {
        executionJob?.cancel()
        _isExecuting.value = false
    }

    // ──────────────────────────────────────────────
    // Public API: Dispatch a single gesture for real-time replay during recording
    // This is a lightweight, non-queued version for the overlay's capture-replay cycle
    // ──────────────────────────────────────────────

    fun dispatchSingleGesture(step: ActionStepEntity, onDone: () -> Unit) {
        serviceScope.launch {
            try {
                when (step.type) {
                    "TAP" -> performTap(step.x, step.y, step.durationMs.coerceAtLeast(50L))
                    "LONG_PRESS" -> performTap(step.x, step.y, step.durationMs.coerceAtLeast(800L))
                    "SWIPE" -> performSwipe(
                        step.x, step.y,
                        step.endX, step.endY,
                        step.durationMs.coerceAtLeast(150L)
                    )
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error dispatching single gesture", e)
            } finally {
                onDone()
            }
        }
    }

    // ──────────────────────────────────────────────
    // Private gesture implementations
    // ──────────────────────────────────────────────

    private suspend fun performTap(x: Int, y: Int, durationMs: Long) {
        val path = Path().apply {
            moveTo(x.toFloat(), y.toFloat())
        }
        val stroke = GestureDescription.StrokeDescription(path, 0, durationMs.coerceAtLeast(50L))
        val gesture = GestureDescription.Builder().addStroke(stroke).build()
        dispatchGestureAwait(gesture)
    }

    private suspend fun performSwipe(startX: Int, startY: Int, endX: Int, endY: Int, durationMs: Long) {
        val path = Path().apply {
            moveTo(startX.toFloat(), startY.toFloat())
            lineTo(endX.toFloat(), endY.toFloat())
        }
        val stroke = GestureDescription.StrokeDescription(path, 0, durationMs.coerceAtLeast(100L))
        val gesture = GestureDescription.Builder().addStroke(stroke).build()
        dispatchGestureAwait(gesture)
    }

    private suspend fun performPasteText(x: Int, y: Int, textPayload: String) {
        if (x > 0 && y > 0) {
            performTap(x, y, 100L)
            delay(200L)
        }
        try {
            val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip = ClipData.newPlainText("AutoActionText", textPayload)
            clipboard.setPrimaryClip(clip)
        } catch (e: Exception) {
            Log.e(TAG, "Error setting clipboard", e)
        }
        delay(150L)
        val targetNode = findFocus(AccessibilityNodeInfo.FOCUS_INPUT) ?: rootInActiveWindow
        targetNode?.let { node ->
            val arguments = Bundle().apply {
                putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, textPayload)
            }
            val successSet = node.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, arguments)
            if (!successSet) {
                node.performAction(AccessibilityNodeInfo.ACTION_PASTE)
            }
        }
    }

    private suspend fun performCopyText(x: Int, y: Int) {
        if (x > 0 && y > 0) {
            performTap(x, y, 100L)
            delay(200L)
        }
        val targetNode = findFocus(AccessibilityNodeInfo.FOCUS_INPUT) ?: rootInActiveWindow
        targetNode?.performAction(AccessibilityNodeInfo.ACTION_COPY)
    }

    private fun performTakeScreenshot() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            performGlobalAction(GLOBAL_ACTION_TAKE_SCREENSHOT)
        }
    }

    /**
     * Suspends until the gesture dispatch completes or is cancelled.
     */
    private suspend fun dispatchGestureAwait(gesture: GestureDescription) {
        suspendCancellableCoroutine { continuation: CancellableContinuation<Unit> ->
            val handler = Handler(Looper.getMainLooper())
            dispatchGesture(gesture, object : GestureResultCallback() {
                override fun onCompleted(gestureDescription: GestureDescription?) {
                    if (continuation.isActive) continuation.resumeWith(Result.success(Unit))
                }

                override fun onCancelled(gestureDescription: GestureDescription?) {
                    if (continuation.isActive) continuation.resumeWith(Result.success(Unit))
                }
            }, handler)
        }
    }

    companion object {
        private const val TAG = "AutoActionService"

        var instance: AutoActionAccessibilityService? = null
            private set

        private val _isConnected = MutableStateFlow(false)
        val isConnected: StateFlow<Boolean> = _isConnected

        private val _isExecuting = MutableStateFlow(false)
        val isExecuting: StateFlow<Boolean> = _isExecuting

        fun isAccessibilityEnabled(context: Context): Boolean {
            val prefString = Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            )
            val packageName = context.packageName
            return prefString?.contains("$packageName/") == true
        }

        fun openAccessibilitySettings(context: Context) {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        }
    }
}
