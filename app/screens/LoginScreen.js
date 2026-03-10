import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme, Surface } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { StatusBar } from 'expo-status-bar';


export default function LoginScreen() {
  const { loginMock } = useAuth();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" />

      <View style={styles.heroSection}>
        <Text style={styles.logo}>⚡</Text>
        <Text variant="displaySmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          WorkFlo
        </Text>
        <Text variant="titleMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Automate your workflow
        </Text>
      </View>

      <Surface style={[styles.card, { backgroundColor: theme.colors.elevation.level2 }]} elevation={3}>
        <Text variant="bodyMedium" style={[styles.cardText, { color: theme.colors.onSurfaceVariant }]}>
          Create, manage, and automate tasks with real-time API integrations. Track weather, fetch data, and schedule reminders — all in one place.
        </Text>

        <Button
          mode="contained"
          onPress={loginMock}
          style={styles.loginBtn}
          contentStyle={styles.loginBtnContent}
          labelStyle={styles.loginLabel}
          icon="login"
        >
          Sign in with Auth0
        </Button>

        <Text variant="labelSmall" style={[styles.note, { color: theme.colors.onSurfaceVariant }]}>
          Demo mode — no Auth0 credentials required
        </Text>
      </Surface>

      <Text variant="labelSmall" style={[styles.footer, { color: theme.colors.onSurfaceVariant }]}>
        Built with React Native + Expo
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: 4,
    fontWeight: '400',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
  },
  cardText: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  loginBtn: {
    width: '100%',
    borderRadius: 14,
  },
  loginBtnContent: {
    paddingVertical: 8,
  },
  loginLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    marginTop: 16,
    opacity: 0.7,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    opacity: 0.5,
  },
});
