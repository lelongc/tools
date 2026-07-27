package com.example.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Swipe
import androidx.compose.material.icons.filled.TouchApp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.ActionStepEntity
import com.example.ui.theme.DangerRed
import com.example.ui.theme.NeonPink
import com.example.ui.viewmodel.AutoActionViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ActionDetailEditorScreen(
    actionId: Int,
    viewModel: AutoActionViewModel,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val actions by viewModel.allActions.collectAsState()
    val existingAction = actions.find { it.action.id == actionId }

    var actionName by remember { mutableStateOf(existingAction?.action?.name ?: "Hành động Tự động ${actions.size + 1}") }
    val steps = remember { mutableStateListOf<ActionStepEntity>() }

    LaunchedEffect(existingAction) {
        if (existingAction != null && steps.isEmpty()) {
            steps.clear()
            steps.addAll(existingAction.steps)
        }
    }

    var selectedGestureMode by remember { mutableStateOf("TAP") } // "TAP" or "SWIPE"

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (actionId == 0) "Tạo Thao Tác Trong App" else "Chỉnh Sửa Thao Tác", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Quay lại")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface,
                    titleContentColor = MaterialTheme.colorScheme.onSurface,
                    navigationIconContentColor = MaterialTheme.colorScheme.onSurface
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Action Name Field
            item {
                OutlinedTextField(
                    value = actionName,
                    onValueChange = { actionName = it },
                    label = { Text("Tên hành động") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = MaterialTheme.colorScheme.primary,
                        unfocusedBorderColor = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                        focusedTextColor = MaterialTheme.colorScheme.onSurface,
                        unfocusedTextColor = MaterialTheme.colorScheme.onSurface
                    )
                )
            }

            // Gesture Mode Toggle (Tap / Swipe)
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Button(
                        onClick = { selectedGestureMode = "TAP" },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (selectedGestureMode == "TAP") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                            contentColor = if (selectedGestureMode == "TAP") Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                        ),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(imageVector = Icons.Default.TouchApp, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Chạm (Tap)")
                    }

                    Button(
                        onClick = { selectedGestureMode = "SWIPE" },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (selectedGestureMode == "SWIPE") MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.surfaceVariant,
                            contentColor = Color.White
                        ),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Swipe, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Vuốt (Swipe)")
                    }
                }
            }

            // Interactive Canvas Screen
            item {
                Text(
                    text = "MÔ PHỎNG MÀN HÌNH - CHẠM HẶC VUỐT ĐỂ TẠO BƯỚC",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )

                Spacer(modifier = Modifier.height(8.dp))

                var dragStartOffset by remember { mutableStateOf<Offset?>(null) }
                var dragCurrentOffset by remember { mutableStateOf<Offset?>(null) }

                val primaryColor = MaterialTheme.colorScheme.primary
                val secondaryColor = MaterialTheme.colorScheme.secondary

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(260.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(MaterialTheme.colorScheme.surface)
                        .border(2.dp, MaterialTheme.colorScheme.primary, RoundedCornerShape(20.dp))
                        .pointerInput(selectedGestureMode) {
                            if (selectedGestureMode == "TAP") {
                                detectTapGestures { offset ->
                                    val realX = (offset.x * 1080 / size.width).toInt()
                                    val realY = (offset.y * 2340 / size.height).toInt()
                                    steps.add(
                                        ActionStepEntity(
                                            actionId = actionId,
                                            stepOrder = steps.size + 1,
                                            type = "TAP",
                                            x = realX,
                                            y = realY,
                                            durationMs = 150,
                                            delayAfterMs = 1000
                                        )
                                    )
                                }
                            } else {
                                detectDragGestures(
                                    onDragStart = { start ->
                                        dragStartOffset = start
                                        dragCurrentOffset = start
                                    },
                                    onDrag = { change, _ ->
                                        dragCurrentOffset = change.position
                                    },
                                    onDragEnd = {
                                        val start = dragStartOffset
                                        val end = dragCurrentOffset
                                        if (start != null && end != null) {
                                            val startX = (start.x * 1080 / size.width).toInt()
                                            val startY = (start.y * 2340 / size.height).toInt()
                                            val endX = (end.x * 1080 / size.width).toInt()
                                            val endY = (end.y * 2340 / size.height).toInt()

                                            steps.add(
                                                ActionStepEntity(
                                                    actionId = actionId,
                                                    stepOrder = steps.size + 1,
                                                    type = "SWIPE",
                                                    x = startX,
                                                    y = startY,
                                                    endX = endX,
                                                    endY = endY,
                                                    durationMs = 400,
                                                    delayAfterMs = 1500
                                                )
                                            )
                                        }
                                        dragStartOffset = null
                                        dragCurrentOffset = null
                                    }
                                )
                            }
                        }
                ) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        // Draw grid lines
                        val gridCount = 5
                        for (i in 1..gridCount) {
                            val x = size.width * i / (gridCount + 1)
                            drawLine(
                                color = Color.Gray.copy(alpha = 0.15f),
                                start = Offset(x, 0f),
                                end = Offset(x, size.height),
                                strokeWidth = 1f
                            )
                        }

                        // Draw recorded steps visual indicators
                        steps.forEachIndexed { index, step ->
                            val drawX = step.x * size.width / 1080
                            val drawY = step.y * size.height / 2340

                            if (step.type == "TAP") {
                                drawCircle(
                                    color = primaryColor,
                                    radius = 20f,
                                    center = Offset(drawX, drawY)
                                )
                                drawCircle(
                                    color = Color.White,
                                    radius = 8f,
                                    center = Offset(drawX, drawY)
                                )
                            } else if (step.type == "SWIPE") {
                                val endDrawX = step.endX * size.width / 1080
                                val endDrawY = step.endY * size.height / 2340

                                drawLine(
                                    color = secondaryColor,
                                    start = Offset(drawX, drawY),
                                    end = Offset(endDrawX, endDrawY),
                                    strokeWidth = 6f,
                                    cap = StrokeCap.Round
                                )
                                drawCircle(color = primaryColor, radius = 12f, center = Offset(drawX, drawY))
                                drawCircle(color = NeonPink, radius = 12f, center = Offset(endDrawX, endDrawY))
                            }
                        }

                        // Draw active drag line
                        val start = dragStartOffset
                        val current = dragCurrentOffset
                        if (start != null && current != null) {
                            drawLine(
                                color = NeonPink,
                                start = start,
                                end = current,
                                strokeWidth = 8f,
                                cap = StrokeCap.Round
                            )
                        }
                    }

                    Text(
                        text = if (selectedGestureMode == "TAP") "Chạm vị trí bất kỳ để thêm bước Tap" else "Kéo thả vệt trên hình để thêm bước Swipe",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 11.sp,
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .padding(10.dp)
                    )
                }
            }

            // Steps List Section
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "DANH SÁCH BƯỚC THAO TÁC (${steps.size})",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )

                    if (steps.isNotEmpty()) {
                        IconButton(onClick = { steps.clear() }) {
                            Icon(imageVector = Icons.Default.Delete, contentDescription = "Xoá tất cả", tint = DangerRed)
                        }
                    }
                }
            }

            itemsIndexed(steps) { index, step ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(28.dp)
                                        .clip(CircleShape)
                                        .background(
                                            when (step.type) {
                                                "TAP" -> MaterialTheme.colorScheme.primary
                                                "SWIPE" -> MaterialTheme.colorScheme.secondary
                                                "PASTE_TEXT" -> Color(0xA8, 0x55, 0xF7)
                                                "COPY_TEXT" -> Color(0x3B, 0x82, 0xF6)
                                                "SCREENSHOT" -> Color(0xF5, 0x9E, 0x0B)
                                                "GLOBAL_BACK" -> Color(0x02, 0x84, 0xC7)
                                                else -> Color(0x63, 0x66, 0xF1)
                                            }
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "${index + 1}",
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp
                                    )
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = when (step.type) {
                                            "TAP" -> "BƯỚC ${index + 1}: CHẠM (TAP)"
                                            "SWIPE" -> "BƯỚC ${index + 1}: VUỐT (SWIPE)"
                                            "PASTE_TEXT" -> "BƯỚC ${index + 1}: DÁN VĂN BẢN (PASTE)"
                                            "COPY_TEXT" -> "BƯỚC ${index + 1}: COPY TEXT"
                                            "SCREENSHOT" -> "BƯỚC ${index + 1}: CHỤP MÀN HÌNH"
                                            "GLOBAL_BACK" -> "BƯỚC ${index + 1}: NÚT BACK"
                                            else -> "BƯỚC ${index + 1}: NÚT HOME"
                                        },
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = when (step.type) {
                                            "TAP" -> "Toạ độ: X=${step.x}, Y=${step.y}"
                                            "SWIPE" -> "Từ (X=${step.x}, Y=${step.y}) ➔ (X=${step.endX}, Y=${step.endY})"
                                            "PASTE_TEXT" -> "Nội dung: '${step.textPayload}'"
                                            "COPY_TEXT" -> "Copy nội dung từ màn hình"
                                            "SCREENSHOT" -> "Chụp ảnh màn hình hiện tại"
                                            "GLOBAL_BACK" -> "Bấm nút Back quay lại"
                                            else -> "Bấm nút Home quay về Màn hình chính"
                                        },
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            IconButton(onClick = { steps.removeAt(index) }) {
                                Icon(imageVector = Icons.Default.Delete, contentDescription = "Xoá bước", tint = DangerRed)
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Delay adjustment slider
                        Text(
                            text = "Độ trễ sau bước này: ${step.delayAfterMs} ms",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Slider(
                            value = step.delayAfterMs.toFloat(),
                            onValueChange = { steps[index] = step.copy(delayAfterMs = it.toLong()) },
                            valueRange = 100f..5000f,
                            colors = SliderDefaults.colors(
                                thumbColor = MaterialTheme.colorScheme.primary,
                                activeTrackColor = MaterialTheme.colorScheme.primary
                            )
                        )
                    }
                }
            }

            // Save Action Button
            item {
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = {
                        viewModel.saveAction(
                            actionId = actionId,
                            name = actionName,
                            steps = steps,
                            onSuccess = onBack
                        )
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary, contentColor = Color.White)
                ) {
                    Icon(imageVector = Icons.Default.Save, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("LƯU THAO TÁC", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                }
            }
        }
    }
}
