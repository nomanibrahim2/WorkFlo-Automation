import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Alert, Platform } from 'react-native';
import {
  Appbar,
  Text,
  Button,
  Surface,
  Chip,
  useTheme,
  Divider,
  Dialog,
  Portal,
  Paragraph,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getAllTasks, saveTask, deleteTask } from '../utils/storage';
import { fetchWeather } from '../services/weatherService';
import { fetchPost } from '../services/dataFetchService';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_COLORS = {
  Active: '#22c55e',
  Paused: '#f59e0b',
  Completed: '#6366f1',
};

const CATEGORY_ICONS = {
  Weather: '☁️',
  Reminder: '🔔',
  'Data Fetch': '📡',
};

export default function TaskDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { taskId } = useLocalSearchParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [runError, setRunError] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const loadTask = useCallback(async () => {
    const tasks = await getAllTasks();
    const found = tasks.find((t) => t.id === taskId);
    if (found) {
      setTask(found);
      if (found.lastResult) setRunResult(found.lastResult);
    }
    setLoading(false);
  }, [taskId]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleRunNow = async () => {
    if (!task) return;
    setRunning(true);
    setRunResult(null);
    setRunError(null);

    try {
      let result;
      if (task.category === 'Weather') {
        result = await fetchWeather();
      } else if (task.category === 'Data Fetch') {
        result = await fetchPost(1);
      } else {
        // Reminder — simulate
        result = { message: 'Reminder triggered successfully!', timestamp: new Date().toISOString() };
      }

      const updatedTask = {
        ...task,
        lastRunTime: new Date().toISOString(),
        lastResult: result,
        status: 'Completed',
      };
      await saveTask(updatedTask);
      setTask(updatedTask);
      setRunResult(result);
    } catch (err) {
      setRunError(err.message || 'Task execution failed.');
    } finally {
      setRunning(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!task) return;
    const nextStatus = task.status === 'Active' ? 'Paused' : 'Active';
    const updated = { ...task, status: nextStatus };
    await saveTask(updated);
    setTask(updated);
  };

  const handleDelete = async () => {
    setDeleteDialogVisible(false);
    await deleteTask(taskId);
    router.back();
  };

  const handleEdit = () => {
    router.push({
      pathname: '/screens/CreateTaskScreen',
      params: { task: JSON.stringify(task) },
    });
  };

  const confirmDelete = () => {
    if (Platform.OS === 'web') {
      setDeleteDialogVisible(true);
    } else {
      Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]);
    }
  };

  if (loading) return <LoadingSpinner message="Loading task…" />;

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level2 }}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Task Not Found" />
        </Appbar.Header>
        <View style={styles.notFound}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            This task could not be found.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level2 }} elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Task Detail" titleStyle={{ fontWeight: '700' }} />
        <Appbar.Action icon="pencil" onPress={handleEdit} />
        <Appbar.Action icon="delete" onPress={confirmDelete} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Task Header */}
        <Surface style={[styles.headerCard, { backgroundColor: theme.colors.elevation.level2 }]} elevation={2}>
          <Text style={styles.categoryIcon}>{CATEGORY_ICONS[task.category] || '📋'}</Text>
          <Text variant="headlineSmall" style={[styles.taskTitle, { color: theme.colors.onSurface }]}>
            {task.name}
          </Text>
          <View style={styles.chipRow}>
            <Chip
              compact
              style={[styles.statusChip, { backgroundColor: STATUS_COLORS[task.status] + '22' }]}
            >
              <Text style={{ color: STATUS_COLORS[task.status], fontWeight: '700', fontSize: 12 }}>
                {task.status}
              </Text>
            </Chip>
            <Chip compact icon="tag" style={styles.metaChip}>{task.category}</Chip>
          </View>
        </Surface>

        {/* Description */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.elevation.level1 }]} elevation={1}>
          <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Description
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, lineHeight: 22 }}>
            {task.description}
          </Text>
        </Surface>

        {/* Details */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.elevation.level1 }]} elevation={1}>
          <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Details
          </Text>
          <View style={styles.detailRow}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Trigger</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{task.triggerType}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.detailRow}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Frequency</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{task.frequency}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.detailRow}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Created</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {task.createdAt ? new Date(task.createdAt).toLocaleString() : '—'}
            </Text>
          </View>
          {task.lastRunTime && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.detailRow}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Last Run</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {new Date(task.lastRunTime).toLocaleString()}
                </Text>
              </View>
            </>
          )}
        </Surface>

        {/* Run Now */}
        <View style={styles.actionRow}>
          <Button
            mode="contained"
            onPress={handleRunNow}
            loading={running}
            disabled={running}
            style={styles.runBtn}
            contentStyle={styles.runBtnContent}
            icon="play"
          >
            {running ? 'Running…' : 'Run Now'}
          </Button>
          <Button
            mode="outlined"
            onPress={handleStatusToggle}
            style={styles.toggleBtn}
            icon={task.status === 'Active' ? 'pause' : 'play'}
          >
            {task.status === 'Active' ? 'Pause' : 'Resume'}
          </Button>
        </View>

        {/* Run Result */}
        {running && <LoadingSpinner message="Executing task…" />}

        {runError && (
          <Surface style={[styles.resultCard, { backgroundColor: '#fecaca33' }]} elevation={1}>
            <Text variant="labelLarge" style={{ color: '#ef4444', fontWeight: '700' }}>
              ❌ Error
            </Text>
            <Text variant="bodyMedium" style={{ color: '#ef4444', marginTop: 8 }}>
              {runError}
            </Text>
          </Surface>
        )}

        {runResult && !running && (
          <Surface style={[styles.resultCard, { backgroundColor: theme.colors.elevation.level2 }]} elevation={1}>
            <Text variant="labelLarge" style={[styles.sectionTitle, { color: '#22c55e' }]}>
              ✅ Last Result
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurface, fontFamily: Platform.OS === 'web' ? 'monospace' : undefined }}
            >
              {JSON.stringify(runResult, null, 2)}
            </Text>
          </Surface>
        )}
      </ScrollView>

      {/* Delete confirmation dialog (web) */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Task</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete this task? This cannot be undone.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDelete} textColor="#ef4444">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: { fontSize: 48, marginBottom: 12 },
  taskTitle: { fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  chipRow: { flexDirection: 'row', gap: 8 },
  statusChip: { borderRadius: 20 },
  metaChip: { borderRadius: 12 },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  divider: { opacity: 0.3 },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  runBtn: { flex: 2, borderRadius: 14 },
  runBtnContent: { paddingVertical: 6 },
  toggleBtn: { flex: 1, borderRadius: 14 },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
});
