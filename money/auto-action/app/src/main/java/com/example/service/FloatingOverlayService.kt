package com.example.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.provider.Settings
import android.text.InputType
import android.util.Log
import android.util.TypedValue
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import com.example.MainActivity
import com.example.data.model.ActionEntity
import com.example.data.model.ActionStepEntity
import com.example.data.repository.ActionRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import java.util.concurrent.LinkedBlockingQueue
import kotlin.math.abs

class FloatingOverlayService : Service() {

    private var windowManager: WindowManager? = null
    private var controlBarView: View? = null
    private var liveRecordOverlayView: View? = null

    private val recordedSteps = mutableListOf<ActionStepEntity>()
    private var isLiveRecording = false

    // Track real delay between user's touches
    private var lastStepTimestampMs = 0L

    // Gesture injection queue to prevent race conditions
    private var isInjecting = false

    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private lateinit var repository: ActionRepository

    // UI refs
    private var bubbleCircleView: TextView? = null
    private var isMenuExpanded = false
    private var toolMenuContainer: LinearLayout? = null

    // Save dialog ref for safe removal
    private var saveDialogView: View? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        instance = this
        repository = ActionRepository(application)
        _isOverlayRunning.value = true
        startForegroundServiceNotification()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        try {
            startForegroundServiceNotification()
            if (Settings.canDrawOverlays(this)) {
                showControlBar()
            } else {
                Toast.makeText(this, "Chưa cấp quyền Hiển thị trên ứng dụng khác (Overlay)", Toast.LENGTH_LONG).show()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error in onStartCommand", e)
        }
        return START_STICKY
    }

    // ──────────────────────────────────────────────
    // Control Bar (Floating Bubble Widget)
    // ──────────────────────────────────────────────

    private fun showControlBar() {
        if (controlBarView != null) return
        try {
            windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

            val overlayType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                @Suppress("DEPRECATION") WindowManager.LayoutParams.TYPE_PHONE

            val windowLayoutParams = WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                overlayType,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT
            ).apply {
                gravity = Gravity.TOP or Gravity.START
                x = 20
                y = 300
            }

            // Outer wrapper container
            val mainWrapper = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                gravity = Gravity.CENTER_VERTICAL
            }

            // Compact Floating Circular Bubble Widget (56dp x 56dp)
            val circleSize = (56 * resources.displayMetrics.density).toInt()
            val bubbleCircle = TextView(this).apply {
                text = "🔴\nQUAY"
                setTextColor(Color.WHITE)
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 10f)
                typeface = Typeface.DEFAULT_BOLD
                gravity = Gravity.CENTER
                elevation = 20f

                val circleBg = android.graphics.drawable.GradientDrawable().apply {
                    shape = android.graphics.drawable.GradientDrawable.OVAL
                    setColor(Color.parseColor("#1E293B"))
                    setStroke(5, Color.parseColor("#EF4444"))
                }
                background = circleBg
                this.layoutParams = LinearLayout.LayoutParams(circleSize, circleSize)
            }
            bubbleCircleView = bubbleCircle
            mainWrapper.addView(bubbleCircle)

            // Mini Expand/Menu Toggle Button
            val menuToggleBtn = TextView(this).apply {
                text = " ⚙️ "
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
                setPadding(8, 8, 8, 8)
                setTextColor(Color.WHITE)
                val btnBg = android.graphics.drawable.GradientDrawable().apply {
                    shape = android.graphics.drawable.GradientDrawable.OVAL
                    setColor(Color.parseColor("#334155"))
                }
                background = btnBg
                val lp = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { setMargins(8, 0, 8, 0) }
                this.layoutParams = lp
                setOnClickListener { toggleToolMenu() }
            }
            mainWrapper.addView(menuToggleBtn)

            // Tool Menu Container (hidden by default)
            val toolMenu = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                gravity = Gravity.CENTER_VERTICAL
                visibility = View.GONE
                setPadding(10, 6, 10, 6)
                val cardBg = android.graphics.drawable.GradientDrawable().apply {
                    setColor(Color.parseColor("#0F172A"))
                    cornerRadius = 24f
                    setStroke(2, Color.parseColor("#38BDF8"))
                }
                background = cardBg
            }

            toolMenu.addView(createOverlayButton("▶️ Chạy", "#10B981") { playRecordedSequence() })
            toolMenu.addView(createOverlayButton("💾 Lưu", "#FFB703") { showSaveActionDialog() })
            toolMenu.addView(createOverlayButton("🗑️ Xoá", "#64748B") { clearAllRecordedSteps() })
            toolMenu.addView(createOverlayButton("📋 Copy", "#8B5CF6") {
                if (isLiveRecording) {
                    val now = System.currentTimeMillis()
                    val realDelay = if (lastStepTimestampMs > 0) (now - lastStepTimestampMs).coerceAtLeast(300L) else 500L
                    lastStepTimestampMs = now
                    val step = ActionStepEntity(
                        actionId = 0,
                        stepOrder = recordedSteps.size + 1,
                        type = "COPY_TEXT",
                        x = 0,
                        y = 0,
                        durationMs = 100L,
                        delayAfterMs = realDelay
                    )
                    recordedSteps.add(step)
                    updateBubbleCircleUI()
                    AutoActionAccessibilityService.instance?.dispatchSingleGesture(step) {}
                    Toast.makeText(this, "📋 Đã thêm bước Copy Text!", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, "Hãy bấm BẮT ĐẦU QUAY 🔴 trước khi thêm bước Copy!", Toast.LENGTH_SHORT).show()
                }
            })
            toolMenu.addView(createOverlayButton("⬅️ Back", "#6366F1") {
                if (isLiveRecording) {
                    val now = System.currentTimeMillis()
                    val realDelay = if (lastStepTimestampMs > 0) (now - lastStepTimestampMs).coerceAtLeast(300L) else 500L
                    lastStepTimestampMs = now
                    val step = ActionStepEntity(
                        actionId = 0,
                        stepOrder = recordedSteps.size + 1,
                        type = "GLOBAL_BACK",
                        x = 0,
                        y = 0,
                        durationMs = 100L,
                        delayAfterMs = realDelay
                    )
                    recordedSteps.add(step)
                    updateBubbleCircleUI()
                    AutoActionAccessibilityService.instance?.dispatchSingleGesture(step) {}
                    Toast.makeText(this, "⬅️ Đã thêm bước Nút Back!", Toast.LENGTH_SHORT).show()
                } else {
                    AutoActionAccessibilityService.instance?.performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_BACK)
                }
            })
            toolMenu.addView(createOverlayButton("🏠 App", "#0284C7") {
                val appIntent = Intent(this, MainActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
                }
                startActivity(appIntent)
            })
            toolMenu.addView(createOverlayButton("❌ Đóng", "#EF4444") { stopSelf() })

            toolMenuContainer = toolMenu
            mainWrapper.addView(toolMenu)

            // Touch Dragging & Click Handling for Circular Bubble
            var initialX = 0
            var initialY = 0
            var initialTouchX = 0f
            var initialTouchY = 0f

            bubbleCircle.setOnTouchListener { _, event ->
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        initialX = windowLayoutParams.x
                        initialY = windowLayoutParams.y
                        initialTouchX = event.rawX
                        initialTouchY = event.rawY
                        true
                    }
                    MotionEvent.ACTION_MOVE -> {
                        windowLayoutParams.x = initialX + (event.rawX - initialTouchX).toInt()
                        windowLayoutParams.y = initialY + (event.rawY - initialTouchY).toInt()
                        try {
                            windowManager?.updateViewLayout(mainWrapper, windowLayoutParams)
                        } catch (e: Exception) {
                            Log.e(TAG, "Error updating bubble layout", e)
                        }
                        true
                    }
                    MotionEvent.ACTION_UP -> {
                        val dx = abs(event.rawX - initialTouchX)
                        val dy = abs(event.rawY - initialTouchY)
                        if (dx < 15 && dy < 15) {
                            // Single tap on circle -> Toggle Recording
                            toggleLiveRecording()
                        }
                        true
                    }
                    else -> false
                }
            }

            controlBarView = mainWrapper
            windowManager?.addView(mainWrapper, windowLayoutParams)
        } catch (e: Exception) {
            Log.e(TAG, "Error creating floating control bar", e)
            Toast.makeText(this, "Không thể tạo Bảng nổi: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
        }
    }

    private fun toggleToolMenu() {
        isMenuExpanded = !isMenuExpanded
        toolMenuContainer?.visibility = if (isMenuExpanded) View.VISIBLE else View.GONE
    }

    private fun createOverlayButton(label: String, colorHex: String, onClick: () -> Unit): TextView {
        return TextView(this).apply {
            text = label
            setTextColor(Color.WHITE)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 10f)
            typeface = Typeface.DEFAULT_BOLD
            setPadding(12, 8, 12, 8)
            val btnDrawable = android.graphics.drawable.GradientDrawable().apply {
                setColor(Color.parseColor(colorHex))
                cornerRadius = 16f
            }
            background = btnDrawable
            val marginParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply { setMargins(4, 3, 4, 3) }
            layoutParams = marginParams
            setOnClickListener { onClick() }
        }
    }

    // ──────────────────────────────────────────────
    // Live Recording Engine
    // ──────────────────────────────────────────────

    private fun toggleLiveRecording() {
        if (!isLiveRecording) {
            val service = AutoActionAccessibilityService.instance
            if (service == null) {
                val isEnabledInSettings = AutoActionAccessibilityService.isAccessibilityEnabled(this)
                val msg = if (isEnabledInSettings) {
                    "⚠️ Dịch vụ Trợ năng bị ngắt kết nối do app vừa khởi động lại!\nVui lòng vào Cài đặt -> TẮT nút AutoAction Pro rồi BẬT LẠI để kết nối lại."
                } else {
                    "⚠️ Vui lòng bật Dịch vụ Trợ năng (Accessibility) cho AutoAction Pro trong Cài đặt!"
                }
                Toast.makeText(this, msg, Toast.LENGTH_LONG).show()
                AutoActionAccessibilityService.openAccessibilitySettings(this)
                return
            }
        }
        isLiveRecording = !isLiveRecording
        if (isLiveRecording) {
            // Auto-trigger HOME twice when pressing RECORD so user starts recording from clean MAIN Home screen!
            val service = AutoActionAccessibilityService.instance
            service?.performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_HOME)
            Handler(Looper.getMainLooper()).postDelayed({
                service?.performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_HOME)
            }, 350L)
            lastStepTimestampMs = System.currentTimeMillis()
            isInjecting = false
            startFullTouchRecordingOverlay()
            updateBubbleCircleUI()
            Toast.makeText(this, "🔴 BẮT ĐẦU QUAY! Đã tự về MÀN HÌNH CHÍNH (2 lần Home)...", Toast.LENGTH_SHORT).show()
        } else {
            removeTouchRecordingOverlay()
            updateBubbleCircleUI()
            Toast.makeText(this, "⏹️ ĐÃ DỪNG QUAY! Đã ghi ${recordedSteps.size} bước.", Toast.LENGTH_SHORT).show()
        }
    }

    private fun updateBubbleCircleUI() {
        bubbleCircleView?.let { circle ->
            val bg = android.graphics.drawable.GradientDrawable().apply {
                shape = android.graphics.drawable.GradientDrawable.OVAL
                if (isLiveRecording) {
                    setColor(Color.parseColor("#DC2626"))
                    setStroke(6, Color.parseColor("#FEF08A"))
                } else {
                    setColor(Color.parseColor("#1E293B"))
                    setStroke(5, Color.parseColor("#EF4444"))
                }
            }
            circle.background = bg
            if (isLiveRecording) {
                circle.text = "REC ●\n${recordedSteps.size}"
            } else {
                circle.text = if (recordedSteps.isEmpty()) "🔴\nQUAY" else "⏹️\n${recordedSteps.size}"
            }
        }
    }

    /**
     * Creates a full-screen transparent overlay to capture touch events.
     *
     * Recording cycle per touch:
     * 1. Overlay captures ACTION_DOWN → ACTION_MOVE → ACTION_UP
     * 2. Records the gesture (TAP, SWIPE, or LONG_PRESS) with real timing
     * 3. Sets FLAG_NOT_TOUCHABLE on overlay to let touches pass through
     * 4. Dispatches the captured gesture via AccessibilityService to the app underneath
     * 5. After dispatch completes, restores overlay to capture mode
     */
    private fun startFullTouchRecordingOverlay() {
        if (liveRecordOverlayView != null) return

        val overlayType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        else
            @Suppress("DEPRECATION") WindowManager.LayoutParams.TYPE_PHONE

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            overlayType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
            }
        }

        val captureView = FrameLayout(this)
        var startX = 0f
        var startY = 0f
        var startTime = 0L

        captureView.setOnTouchListener { _, event ->
            if (!isLiveRecording || isInjecting) return@setOnTouchListener false

            // Check if touch is inside floating control bar area
            controlBarView?.let { bar ->
                val location = IntArray(2)
                bar.getLocationOnScreen(location)
                val barX = location[0]
                val barY = location[1]
                val barW = bar.width
                val barH = bar.height
                if (event.rawX >= barX && event.rawX <= barX + barW &&
                    event.rawY >= barY && event.rawY <= barY + barH
                ) {
                    if (event.action == MotionEvent.ACTION_UP) {
                        bubbleCircleView?.let { circle ->
                            val cLoc = IntArray(2)
                            circle.getLocationOnScreen(cLoc)
                            if (event.rawX >= cLoc[0] && event.rawX <= cLoc[0] + circle.width &&
                                event.rawY >= cLoc[1] && event.rawY <= cLoc[1] + circle.height
                            ) {
                                toggleLiveRecording()
                            }
                        }
                    }
                    return@setOnTouchListener true
                }
            }

            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    startX = event.rawX
                    startY = event.rawY
                    startTime = System.currentTimeMillis()
                    true
                }
                MotionEvent.ACTION_UP -> {
                    val endX = event.rawX
                    val endY = event.rawY
                    val touchDuration = System.currentTimeMillis() - startTime
                    val deltaX = abs(endX - startX)
                    val deltaY = abs(endY - startY)

                    val now = System.currentTimeMillis()
                    val realDelay = if (lastStepTimestampMs > 0) {
                        (now - lastStepTimestampMs).coerceAtLeast(100L)
                    } else {
                        500L
                    }
                    lastStepTimestampMs = now

                    val step = when {
                        // SWIPE: finger moved > 40px
                        deltaX > 40 || deltaY > 40 -> ActionStepEntity(
                            actionId = 0,
                            stepOrder = recordedSteps.size + 1,
                            type = "SWIPE",
                            x = startX.toInt(),
                            y = startY.toInt(),
                            endX = endX.toInt(),
                            endY = endY.toInt(),
                            durationMs = touchDuration.coerceAtLeast(150L),
                            delayAfterMs = realDelay
                        )
                        // LONG_PRESS: held > 500ms
                        touchDuration >= 500L -> ActionStepEntity(
                            actionId = 0,
                            stepOrder = recordedSteps.size + 1,
                            type = "LONG_PRESS",
                            x = startX.toInt(),
                            y = startY.toInt(),
                            durationMs = touchDuration.coerceAtLeast(800L),
                            delayAfterMs = realDelay
                        )
                        // TAP: quick press
                        else -> ActionStepEntity(
                            actionId = 0,
                            stepOrder = recordedSteps.size + 1,
                            type = "TAP",
                            x = startX.toInt(),
                            y = startY.toInt(),
                            durationMs = 150L,
                            delayAfterMs = realDelay
                        )
                    }

                    recordedSteps.add(step)
                    updateBubbleCircleUI()

                    // Make overlay pass-through, inject gesture into app underneath, then restore capture mode
                    injectGestureAndRestore(step, captureView, params)
                    true
                }
                else -> true
            }
        }

        liveRecordOverlayView = captureView
        windowManager?.addView(captureView, params)

        // Bring controlBarView and saveDialogView to the top of WindowManager z-order so touches hit them directly!
        controlBarView?.let { bar ->
            try {
                val barParams = bar.layoutParams as WindowManager.LayoutParams
                windowManager?.removeView(bar)
                windowManager?.addView(bar, barParams)
            } catch (e: Exception) {
                Log.e(TAG, "Error bringing control bar to front", e)
            }
        }
        saveDialogView?.let { dlg ->
            try {
                val dlgParams = dlg.layoutParams as WindowManager.LayoutParams
                windowManager?.removeView(dlg)
                windowManager?.addView(dlg, dlgParams)
            } catch (e: Exception) {
                Log.e(TAG, "Error bringing save dialog to front", e)
            }
        }
    }

    /**
     * Injection cycle:
     * 1. Set overlay to FLAG_NOT_TOUCHABLE (touches pass through to app)
     * 2. Dispatch gesture via AccessibilityService
     * 3. After dispatch completes, restore overlay to capture mode
     */
    private fun injectGestureAndRestore(
        step: ActionStepEntity,
        captureView: View,
        params: WindowManager.LayoutParams
    ) {
        isInjecting = true

        val captureFlags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
        val passThroughFlags = captureFlags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE

        // Step 1: Make overlay pass-through
        params.flags = passThroughFlags
        safeUpdateViewLayout(captureView, params)

        // Step 2: Give WindowManager & InputDispatcher time to apply FLAG_NOT_TOUCHABLE (~60ms / ~3-4 frames)
        // 60ms is completely imperceptible to human eye/finger, but safe for OS IPC hit-test updates!
        Handler(Looper.getMainLooper()).postDelayed({
            val service = AutoActionAccessibilityService.instance
            if (service != null) {
                service.dispatchSingleGesture(step) {
                    // Step 3: Restore overlay to capture mode after gesture completes & target app responds
                    Handler(Looper.getMainLooper()).postDelayed({
                        if (isLiveRecording && liveRecordOverlayView == captureView) {
                            params.flags = captureFlags
                            safeUpdateViewLayout(captureView, params)
                        }
                        isInjecting = false
                    }, 150L)
                }
            } else {
                // Accessibility not enabled — still restore overlay
                val isEnabledInSettings = AutoActionAccessibilityService.isAccessibilityEnabled(this)
                val msg = if (isEnabledInSettings) {
                    "⚠️ Dịch vụ Trợ năng bị ngắt kết nối do app khởi động lại! Vui lòng TẮT rồi BẬT LẠI AutoAction Pro trong Cài đặt."
                } else {
                    "⚠️ Bật Dịch vụ Trợ năng để thao tác đến app phía dưới!"
                }
                Toast.makeText(this, msg, Toast.LENGTH_LONG).show()
                Handler(Looper.getMainLooper()).postDelayed({
                    if (isLiveRecording && liveRecordOverlayView == captureView) {
                        params.flags = captureFlags
                        safeUpdateViewLayout(captureView, params)
                    }
                    isInjecting = false
                }, 150L)
            }
        }, 60L)
    }

    private fun safeUpdateViewLayout(view: View, params: WindowManager.LayoutParams) {
        try {
            if (view.isAttachedToWindow) {
                windowManager?.updateViewLayout(view, params)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error updating view layout", e)
        }
    }

    private fun removeTouchRecordingOverlay() {
        liveRecordOverlayView?.let { view ->
            safeRemoveView(view)
        }
        liveRecordOverlayView = null
    }

    // ──────────────────────────────────────────────
    // Playback
    // ──────────────────────────────────────────────

    private fun playRecordedSequence() {
        if (recordedSteps.isEmpty()) {
            Toast.makeText(this, "Chưa có thao tác nào! Bấm bong bóng 🔴 để quay.", Toast.LENGTH_LONG).show()
            return
        }

        val service = AutoActionAccessibilityService.instance
        if (service == null) {
            val isEnabledInSettings = AutoActionAccessibilityService.isAccessibilityEnabled(this)
            val msg = if (isEnabledInSettings) {
                "⚠️ Dịch vụ Trợ năng bị ngắt kết nối do app vừa khởi động lại!\nVui lòng vào Cài đặt -> TẮT nút AutoAction Pro rồi BẬT LẠI để kết nối lại."
            } else {
                "⚠️ Vui lòng bật Dịch vụ Trợ năng (Accessibility) cho AutoAction Pro trong Cài đặt!"
            }
            Toast.makeText(this, msg, Toast.LENGTH_LONG).show()
            AutoActionAccessibilityService.openAccessibilitySettings(this)
            return
        }

        Toast.makeText(this, "▶️ Đang quay về Màn hình chính & tự động thực hiện ${recordedSteps.size} thao tác...", Toast.LENGTH_SHORT).show()

        service.executeGestureSequence(
            steps = recordedSteps.toList(),
            onComplete = { success ->
                Handler(Looper.getMainLooper()).post {
                    if (success) {
                        Toast.makeText(this, "🎉 Hoàn thành ${recordedSteps.size} thao tác!", Toast.LENGTH_LONG).show()
                    } else {
                        Toast.makeText(this, "Lỗi khi thực thi thao tác", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        )
    }

    // ──────────────────────────────────────────────
    // Save Action Dialog
    // ──────────────────────────────────────────────

    private fun showSaveActionDialog() {
        if (recordedSteps.isEmpty()) {
            Toast.makeText(this, "Chưa có thao tác nào để lưu!", Toast.LENGTH_SHORT).show()
            return
        }

        // Remove existing dialog if any
        saveDialogView?.let { safeRemoveView(it) }

        val dialogContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(24, 20, 24, 20)
            val cardDrawable = android.graphics.drawable.GradientDrawable().apply {
                setColor(Color.parseColor("#0F172A"))
                cornerRadius = 24f
                setStroke(4, Color.parseColor("#10B981"))
            }
            background = cardDrawable
        }

        val titleTv = TextView(this).apply {
            text = "💾 LƯU HÀNH ĐỘNG VÀO APP"
            setTextColor(Color.parseColor("#10B981"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
            typeface = Typeface.DEFAULT_BOLD
        }
        dialogContainer.addView(titleTv)

        val stepCountTv = TextView(this).apply {
            text = "Đã ghi ${recordedSteps.size} bước thao tác"
            setTextColor(Color.parseColor("#94A3B8"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 11f)
            setPadding(0, 4, 0, 8)
        }
        dialogContainer.addView(stepCountTv)

        val inputEt = EditText(this).apply {
            hint = "Tên hành động (vd: Copy Zalo Paste Facebook)"
            setHintTextColor(Color.GRAY)
            setTextColor(Color.WHITE)
            inputType = InputType.TYPE_CLASS_TEXT
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 13f)
            setPadding(16, 12, 16, 12)
            val inputBg = android.graphics.drawable.GradientDrawable().apply {
                setColor(Color.parseColor("#1E293B"))
                cornerRadius = 12f
            }
            background = inputBg
        }
        dialogContainer.addView(inputEt)

        // Button row
        val buttonRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setPadding(0, 8, 0, 0)
        }

        buttonRow.addView(createOverlayButton("❌ Hủy", "#64748B") {
            saveDialogView?.let { safeRemoveView(it) }
            saveDialogView = null
        })

        buttonRow.addView(createOverlayButton("💾 LƯU (${recordedSteps.size} BƯỚC)", "#10B981") {
            val actionName = inputEt.text.toString().ifBlank {
                "Thao tác #${System.currentTimeMillis() % 10000}"
            }

            val stepsSnapshot = recordedSteps.toList()

            serviceScope.launch {
                val canCreate = repository.canCreateAction()
                if (!canCreate) {
                    Handler(Looper.getMainLooper()).post {
                        Toast.makeText(
                            this@FloatingOverlayService,
                            "Gói Miễn phí chỉ tạo tối đa 1 hành động! Nâng cấp VIP 99k.",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                    return@launch
                }

                val actionEntity = ActionEntity(name = actionName)
                repository.saveAction(actionEntity, stepsSnapshot)

                Handler(Looper.getMainLooper()).post {
                    Toast.makeText(
                        this@FloatingOverlayService,
                        "🎉 Đã lưu '$actionName' (${stepsSnapshot.size} bước)! Mở app để xem.",
                        Toast.LENGTH_LONG
                    ).show()
                    saveDialogView?.let { safeRemoveView(it) }
                    saveDialogView = null
                    clearAllRecordedSteps()
                }
            }
        })

        dialogContainer.addView(buttonRow)

        val overlayType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        else
            @Suppress("DEPRECATION") WindowManager.LayoutParams.TYPE_PHONE

        val dialogParams = WindowManager.LayoutParams(
            (resources.displayMetrics.widthPixels * 0.85).toInt(),
            WindowManager.LayoutParams.WRAP_CONTENT,
            overlayType,
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.CENTER
        }

        saveDialogView = dialogContainer
        windowManager?.addView(dialogContainer, dialogParams)
    }

    // ──────────────────────────────────────────────
    // Cleanup
    // ──────────────────────────────────────────────

    private fun clearAllRecordedSteps() {
        if (isLiveRecording) {
            toggleLiveRecording()
        }
        recordedSteps.clear()
        lastStepTimestampMs = 0L
        isInjecting = false
        updateBubbleCircleUI()
        Toast.makeText(this, "Đã xoá toàn bộ bước thao tác!", Toast.LENGTH_SHORT).show()
    }

    private fun safeRemoveView(view: View) {
        try {
            if (view.isAttachedToWindow) {
                windowManager?.removeView(view)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error removing view", e)
        }
    }

    // ──────────────────────────────────────────────
    // Foreground Service Notification
    // ──────────────────────────────────────────────

    private fun startForegroundServiceNotification() {
        val channelId = "autoaction_overlay_channel"
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "AutoAction Overlay Service",
                NotificationManager.IMPORTANCE_LOW
            )
            notificationManager.createNotificationChannel(channel)
        }

        val notification: Notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("AutoAction Pro đang chạy")
            .setContentText("Bong bóng nổi sẵn sàng ghi & tự động hoá thao tác")
            .setSmallIcon(android.R.drawable.ic_menu_compass)
            .setOngoing(true)
            .build()

        try {
            if (Build.VERSION.SDK_INT >= 34) {
                ServiceCompat.startForeground(
                    this,
                    1001,
                    notification,
                    android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
                )
            } else {
                startForeground(1001, notification)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error starting foreground", e)
            try {
                startForeground(1001, notification)
            } catch (ex: Exception) {
                Log.e(TAG, "Fallback foreground also failed", ex)
            }
        }
    }

    fun addRecordedTap(x: Int, y: Int) {
        if (!isLiveRecording || isInjecting) return
        val now = System.currentTimeMillis()
        if (now - lastStepTimestampMs < 300L && recordedSteps.isNotEmpty()) {
            val last = recordedSteps.last()
            if (abs(last.x - x) < 40 && abs(last.y - y) < 40) {
                return
            }
        }

        val realDelay = if (lastStepTimestampMs > 0) {
            (now - lastStepTimestampMs).coerceAtLeast(300L)
        } else {
            500L
        }
        lastStepTimestampMs = now

        val step = ActionStepEntity(
            actionId = 0,
            stepOrder = recordedSteps.size + 1,
            type = "TAP",
            x = x,
            y = y,
            durationMs = 150L,
            delayAfterMs = realDelay
        )
        recordedSteps.add(step)
        Handler(Looper.getMainLooper()).post {
            updateBubbleCircleUI()
        }
    }

    fun addRecordedTextPaste(x: Int, y: Int, textPayload: String) {
        if (!isLiveRecording || isInjecting) return
        val now = System.currentTimeMillis()

        // If last step was a TAP at approximately the same location, upgrade/replace it with PASTE_TEXT
        if (recordedSteps.isNotEmpty()) {
            val last = recordedSteps.last()
            if (last.type == "TAP" && abs(last.x - x) < 120 && abs(last.y - y) < 120) {
                recordedSteps.removeAt(recordedSteps.size - 1)
            }
        }

        val realDelay = if (lastStepTimestampMs > 0) {
            (now - lastStepTimestampMs).coerceAtLeast(300L)
        } else {
            500L
        }
        lastStepTimestampMs = now

        val step = ActionStepEntity(
            actionId = 0,
            stepOrder = recordedSteps.size + 1,
            type = "PASTE_TEXT",
            x = x,
            y = y,
            durationMs = 200L,
            delayAfterMs = realDelay,
            textPayload = textPayload
        )
        recordedSteps.add(step)
        Handler(Looper.getMainLooper()).post {
            updateBubbleCircleUI()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (instance == this) {
            instance = null
        }
        if (isLiveRecording) {
            isLiveRecording = false
            removeTouchRecordingOverlay()
        }
        saveDialogView?.let { safeRemoveView(it) }
        controlBarView?.let { safeRemoveView(it) }
        controlBarView = null
        saveDialogView = null
        serviceScope.cancel()
        _isOverlayRunning.value = false
    }

    companion object {
        private const val TAG = "FloatingOverlay"

        private val _isOverlayRunning = MutableStateFlow(false)
        val isOverlayRunning: StateFlow<Boolean> = _isOverlayRunning

        private var instance: FloatingOverlayService? = null

        fun isLiveRecordingActive(): Boolean {
            return instance?.isLiveRecording == true && instance?.isInjecting == false
        }

        fun recordExternalTap(x: Int, y: Int) {
            instance?.addRecordedTap(x, y)
        }

        fun recordExternalTextPaste(x: Int, y: Int, textPayload: String) {
            instance?.addRecordedTextPaste(x, y, textPayload)
        }

        fun startService(context: Context) {
            val intent = Intent(context, FloatingOverlayService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stopService(context: Context) {
            val intent = Intent(context, FloatingOverlayService::class.java)
            context.stopService(intent)
        }
    }
}
