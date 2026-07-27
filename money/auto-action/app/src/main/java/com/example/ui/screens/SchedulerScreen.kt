package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Alarm
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.VipGold
import com.example.ui.viewmodel.AutoActionViewModel

@Composable
fun SchedulerScreen(
    viewModel: AutoActionViewModel,
    onNavigateToVip: () -> Unit,
    modifier: Modifier = Modifier
) {
    val actions by viewModel.allActions.collectAsState()
    val quota by viewModel.currentQuota.collectAsState()
    val isVip = quota?.isVip == true

    var selectedActionIndex by remember { mutableStateOf(0) }
    val currentActionWithSteps = actions.getOrNull(selectedActionIndex)

    var scheduleHour by remember { mutableStateOf(8f) }
    var scheduleMinute by remember { mutableStateOf(0f) }

    val daysList = listOf("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN")
    val selectedDays = remember { mutableStateOf(setOf("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN")) }

    var expandedDropdown by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(imageVector = Icons.Default.Schedule, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(28.dp))
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(text = "LÊN LỊCH CHẠY TỰ ĐỘNG 24/7", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                            Text(
                                text = if (isVip) "VIP PRO: Lên lịch tự động không giới hạn" else "FREE: Lên lịch tối đa 1 hành động/tháng",
                                fontSize = 11.sp,
                                color = if (isVip) VipGold else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }

        if (actions.isEmpty()) {
            item {
                Text(
                    text = "Chưa có thao tác nào để lên lịch. Vui lòng tạo thao tác ở trang chủ trước!",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 13.sp,
                    modifier = Modifier.padding(20.dp)
                )
            }
        } else {
            // Action Selector
            item {
                Column {
                    Text(text = "CHỌN HÀNH ĐỘNG CẦN LÊN LỊCH:", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.height(6.dp))
                    Box {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { expandedDropdown = true },
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = currentActionWithSteps?.action?.name ?: "Chọn hành động",
                                    color = MaterialTheme.colorScheme.onSurface,
                                    fontWeight = FontWeight.Bold
                                )
                                Icon(imageVector = Icons.Default.Alarm, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                            }
                        }

                        DropdownMenu(
                            expanded = expandedDropdown,
                            onDismissRequest = { expandedDropdown = false }
                        ) {
                            actions.forEachIndexed { index, item ->
                                DropdownMenuItem(
                                    text = { Text(item.action.name) },
                                    onClick = {
                                        selectedActionIndex = index
                                        expandedDropdown = false
                                    }
                                )
                            }
                        }
                    }
                }
            }

            // Time Picker Sliders
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "THỜI GIAN CHẠY MỖI NGÀY: ${String.format("%02d:%02d", scheduleHour.toInt(), scheduleMinute.toInt())}",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        Text(text = "Giờ: ${scheduleHour.toInt()}h", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface)
                        Slider(
                            value = scheduleHour,
                            onValueChange = { scheduleHour = it },
                            valueRange = 0f..23f,
                            steps = 23,
                            colors = SliderDefaults.colors(thumbColor = MaterialTheme.colorScheme.primary, activeTrackColor = MaterialTheme.colorScheme.primary)
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(text = "Phút: ${scheduleMinute.toInt()}p", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface)
                        Slider(
                            value = scheduleMinute,
                            onValueChange = { scheduleMinute = it },
                            valueRange = 0f..59f,
                            steps = 59,
                            colors = SliderDefaults.colors(thumbColor = MaterialTheme.colorScheme.primary, activeTrackColor = MaterialTheme.colorScheme.primary)
                        )
                    }
                }
            }

            // Days Selection
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = "LẶP LẠI THEO NGÀY:", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            daysList.forEach { day ->
                                val isSelected = selectedDays.value.contains(day)
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant)
                                        .clickable {
                                            val newSet = selectedDays.value.toMutableSet()
                                            if (isSelected) newSet.remove(day) else newSet.add(day)
                                            selectedDays.value = newSet
                                        },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = day.take(2),
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Save Schedule Button
            item {
                Button(
                    onClick = {
                        val current = currentActionWithSteps ?: return@Button
                        viewModel.saveAction(
                            actionId = current.action.id,
                            name = current.action.name,
                            isScheduled = true,
                            hour = scheduleHour.toInt(),
                            minute = scheduleMinute.toInt(),
                            repeatDays = selectedDays.value.joinToString(","),
                            steps = current.steps
                        )
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary, contentColor = Color.White)
                ) {
                    Icon(imageVector = Icons.Default.Schedule, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("LƯU CẤU HÌNH LÊN LỊCH", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                }
            }
        }
    }
}
