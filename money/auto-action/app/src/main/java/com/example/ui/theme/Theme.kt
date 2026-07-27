package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = BluePrimaryLight,
    onPrimary = Color.White,
    primaryContainer = CardLightBlue,
    onPrimaryContainer = BluePrimaryLight,
    secondary = BlueSecondaryLight,
    onSecondary = Color.White,
    tertiary = NeonPink,
    background = BackgroundLight,
    onBackground = TextDarkPrimary,
    surface = SurfaceLight,
    onSurface = TextDarkPrimary,
    surfaceVariant = CardLightBlue,
    onSurfaceVariant = TextDarkMuted
)

private val DarkColorScheme = darkColorScheme(
    primary = BluePrimaryDark,
    onPrimary = BackgroundDark,
    primaryContainer = CardDarkBlue,
    onPrimaryContainer = BluePrimaryDark,
    secondary = BlueSecondaryDark,
    onSecondary = Color.White,
    tertiary = NeonPink,
    background = BackgroundDark,
    onBackground = TextLightPrimary,
    surface = SurfaceDark,
    onSurface = TextLightPrimary,
    surfaceVariant = CardDarkBlue,
    onSurfaceVariant = TextLightMuted
)

@Composable
fun AutoActionProTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
