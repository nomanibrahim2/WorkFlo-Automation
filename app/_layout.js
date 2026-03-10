import React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useThemeMode } from './context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

// ── Custom themes ────────────────────────────────────────────────
const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#818cf8',
    primaryContainer: '#312e81',
    onPrimaryContainer: '#e0e7ff',
    secondary: '#22d3ee',
    secondaryContainer: '#164e63',
    background: '#0f172a',
    surface: '#0f172a',
    surfaceVariant: '#1e293b',
    onSurface: '#f1f5f9',
    onSurfaceVariant: '#94a3b8',
    elevation: {
      level0: '#0f172a',
      level1: '#1e293b',
      level2: '#1e293b',
      level3: '#334155',
      level4: '#475569',
      level5: '#64748b',
    },
  },
  roundness: 12,
};

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6366f1',
    primaryContainer: '#e0e7ff',
    onPrimaryContainer: '#312e81',
    secondary: '#0891b2',
    secondaryContainer: '#cffafe',
    background: '#f8fafc',
    surface: '#f8fafc',
    surfaceVariant: '#e2e8f0',
    onSurface: '#0f172a',
    onSurfaceVariant: '#475569',
    elevation: {
      level0: '#f8fafc',
      level1: '#ffffff',
      level2: '#ffffff',
      level3: '#f1f5f9',
      level4: '#e2e8f0',
      level5: '#cbd5e1',
    },
  },
  roundness: 12,
};

function InnerLayout() {
  const { mode } = useThemeMode();
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InnerLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
