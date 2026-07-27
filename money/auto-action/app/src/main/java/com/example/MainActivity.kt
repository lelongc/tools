package com.example

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.HelpOutline
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.TouchApp
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.sp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.ui.components.PaywallBottomSheet
import com.example.ui.screens.ActionDetailEditorScreen
import com.example.ui.screens.DashboardScreen
import com.example.ui.screens.SchedulerScreen
import com.example.ui.screens.SmsGuideScreen
import com.example.ui.screens.VipUpgradeScreen
import com.example.ui.theme.AutoActionProTheme
import com.example.ui.viewmodel.AutoActionViewModel
import com.example.ui.viewmodel.UiEvent

sealed class BottomNavItem(val route: String, val title: String, val icon: ImageVector) {
    object Dashboard : BottomNavItem("dashboard", "Trang chủ", Icons.Default.TouchApp)
    object Scheduler : BottomNavItem("scheduler", "Lên lịch", Icons.Default.Schedule)
    object Vip : BottomNavItem("vip", "VIP 99k", Icons.Default.Star)
    object SmsGuide : BottomNavItem("guide", "Hướng dẫn", Icons.AutoMirrored.Filled.HelpOutline)
}

class MainActivity : ComponentActivity() {

    private val viewModel: AutoActionViewModel by viewModels()

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            var isDarkTheme by remember { mutableStateOf(false) } // Default Light Theme (Blue & White)

            AutoActionProTheme(darkTheme = isDarkTheme) {
                val context = LocalContext.current
                val navController = rememberNavController()

                val showPaywall by viewModel.showPaywall.collectAsState()
                val paywallReason by viewModel.paywallReason.collectAsState()
                val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

                // Listen for UI events
                LaunchedEffect(Unit) {
                    viewModel.eventFlow.collect { event ->
                        when (event) {
                            is UiEvent.ShowToast -> {
                                Toast.makeText(context, event.message, Toast.LENGTH_SHORT).show()
                            }
                            is UiEvent.ShowPaywall -> {}
                        }
                    }
                }

                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                val bottomBarRoutes = listOf(
                    BottomNavItem.Dashboard.route,
                    BottomNavItem.Scheduler.route,
                    BottomNavItem.Vip.route,
                    BottomNavItem.SmsGuide.route
                )

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        if (currentRoute in bottomBarRoutes) {
                            NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                                val navItems = listOf(
                                    BottomNavItem.Dashboard,
                                    BottomNavItem.Scheduler,
                                    BottomNavItem.Vip,
                                    BottomNavItem.SmsGuide
                                )

                                navItems.forEach { item ->
                                    val isSelected = currentRoute == item.route
                                    NavigationBarItem(
                                        selected = isSelected,
                                        onClick = {
                                            navController.navigate(item.route) {
                                                popUpTo(navController.graph.findStartDestination().id) {
                                                    saveState = true
                                                }
                                                launchSingleTop = true
                                                restoreState = true
                                            }
                                        },
                                        icon = {
                                            Icon(
                                                imageVector = item.icon,
                                                contentDescription = item.title,
                                                tint = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        },
                                        label = {
                                            Text(
                                                text = item.title,
                                                fontSize = 11.sp,
                                                color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        },
                                        colors = NavigationBarItemDefaults.colors(
                                            indicatorColor = MaterialTheme.colorScheme.surfaceVariant
                                        )
                                    )
                                }
                            }
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = BottomNavItem.Dashboard.route,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(BottomNavItem.Dashboard.route) {
                            DashboardScreen(
                                viewModel = viewModel,
                                isDarkTheme = isDarkTheme,
                                onToggleDarkTheme = { isDarkTheme = it },
                                onNavigateToEditor = { actionId ->
                                    navController.navigate("editor/$actionId")
                                },
                                onNavigateToVip = {
                                    navController.navigate(BottomNavItem.Vip.route)
                                },
                                onNavigateToSchedule = {
                                    navController.navigate(BottomNavItem.Scheduler.route)
                                }
                            )
                        }

                        composable("editor/{actionId}", arguments = listOf(navArgument("actionId") { type = NavType.IntType })) { backStack ->
                            val actionId = backStack.arguments?.getInt("actionId") ?: 0
                            ActionDetailEditorScreen(
                                actionId = actionId,
                                viewModel = viewModel,
                                onBack = { navController.popBackStack() }
                            )
                        }

                        composable(BottomNavItem.Scheduler.route) {
                            SchedulerScreen(
                                viewModel = viewModel,
                                onNavigateToVip = {
                                    navController.navigate(BottomNavItem.Vip.route)
                                }
                            )
                        }

                        composable(BottomNavItem.Vip.route) {
                            VipUpgradeScreen(
                                viewModel = viewModel,
                                onBack = { navController.popBackStack() },
                                onNavigateToSmsGuide = {
                                    navController.navigate(BottomNavItem.SmsGuide.route)
                                }
                            )
                        }

                        composable(BottomNavItem.SmsGuide.route) {
                            SmsGuideScreen(
                                onBack = { navController.popBackStack() }
                            )
                        }
                    }

                    // Global Paywall Bottom Sheet
                    if (showPaywall) {
                        PaywallBottomSheet(
                            reason = paywallReason,
                            sheetState = sheetState,
                            onDismiss = { viewModel.hidePaywall() },
                            onOpenVietQrScreen = {
                                navController.navigate(BottomNavItem.Vip.route)
                            }
                        )
                    }
                }
            }
        }
    }
}
