import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import TaskForm from '../components/TaskForm';
import { getAllTasks, saveTask } from '../utils/storage';

const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function CreateTaskScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  // If editing, parse the task from params
  const editTask = params.task ? JSON.parse(params.task) : null;

  const handleSubmit = async (formData) => {
    const task = editTask
      ? {
          ...editTask,
          ...formData,
          updatedAt: new Date().toISOString(),
        }
      : {
          id: generateId(),
          ...formData,
          status: 'Active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastRunTime: null,
          lastResult: null,
        };

    await saveTask(task);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level2 }} elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={editTask ? 'Edit Task' : 'Create Task'}
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <TaskForm
        initialData={editTask}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontWeight: '700' },
});
