package com.example.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.SettingsAccessibility
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.DangerRed
import com.example.ui.theme.SuccessGreen

@Composable
fun AccessibilityPromptCard(
    isEnabled: Boolean,
    onOpenSettings: () -> Unit,
    modifier: Modifier = Modifier,
    isConnected: Boolean = isEnabled
) {
    val isStale = isEnabled && !isConnected
    val isFullyActive = isEnabled && isConnected

    val statusColor = when {
        isFullyActive -> SuccessGreen
        isStale -> Color(0xFFF59E0B) // Warning Orange/Amber
        else -> DangerRed
    }

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = if (isFullyActive) Icons.Default.CheckCircle else Icons.Default.Warning,
                        contentDescription = null,
                        tint = statusColor,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = when {
                            isFullyActive -> "Dịch vụ AutoAction: HOẠT ĐỘNG"
                            isStale -> "Dịch vụ Trợ năng: BỊ NGẮT KẾT NỐI!"
                            else -> "Cần Bật Dịch vụ Accessibility!"
                        },
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = statusColor
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = when {
                    isFullyActive -> "Ứng dụng đã có quyền mô phỏng thao tác chạm và vuốt tự động trên màn hình."
                    isStale -> "App vừa được cập nhật/tắt nên hệ thống Android tạm ngắt dịch vụ. Vui lòng bấm bên dưới mở Cài đặt -> TẮT nút AutoAction Pro đi rồi BẬT LẠI để kích hoạt."
                    else -> "Android yêu cầu cấp quyền Hỗ trợ tiếp cận (Accessibility Service) để AutoAction Pro có thể tự động chạm/vuốt màn hình theo yêu cầu của bạn."
                },
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface,
                fontSize = 12.sp
            )

            if (!isFullyActive) {
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = onOpenSettings,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isStale) Color(0xFFD97706) else DangerRed,
                        contentColor = Color.White
                    )
                ) {
                    Icon(imageVector = Icons.Default.SettingsAccessibility, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isStale) "Tắt & Bật lại Dịch vụ Trợ năng Ngay" else "Bật Accessibility Service Ngay",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )
                }
            }
        }
    }
}
