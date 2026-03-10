import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Platform } from 'react-native';
import { FAB, Text, IconButton, useTheme, Appbar, Divider, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { getAllTasks } from '../utils/storage';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const loadTasks = useCallback(async () => {
    try {
      const all = await getAllTasks();
      setTasks(all);
    } catch (e) {
      console.error('Failed to load tasks:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Re-load tasks when the screen is focused (coming back from create/edit)
  useEffect(() => {
    const interval = setInterval(loadTasks, 2000);
    return () => clearInterval(interval);
  }, [loadTasks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTasks();
  }, [loadTasks]);

  const filteredTasks = tasks.filter((task) => {
    const catMatch = selectedCategory === 'All' || task.category === selectedCategory;
    const statusMatch = selectedStatus === 'All' || task.status === selectedStatus;
    return catMatch && statusMatch;
  });

  const handleFilterChange = (category, status) => {
    setSelectedCategory(category);
    setSelectedStatus(status);
  };

  const handleTaskPress = (task) => {
    router.push({ pathname: '/screens/TaskDetailScreen', params: { taskId: task.id } });
  };

  if (loading) return <LoadingSpinner message="Loading your tasks…" />;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* App Bar */}
      <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level2 }} elevated>
        <Appbar.Content
          title="WorkFlo"
          titleStyle={styles.appTitle}
          subtitle={user?.email || user?.name}
        />
        <Appbar.Action
          icon={mode === 'dark' ? 'weather-sunny' : 'weather-night'}
          onPress={toggleTheme}
        />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>

      {/* Welcome banner */}
      <View style={[styles.banner, { backgroundColor: theme.colors.primaryContainer }]}>
        <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700' }}>
          👋 Welcome, {user?.name || 'User'}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.8 }}>
          {tasks.length} workflow{tasks.length !== 1 ? 's' : ''} configured
        </Text>
      </View>

      {/* Filters */}
      <FilterBar
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        onFilterChange={handleFilterChange}
      />

      <Divider />

      {/* Task list */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} onPress={handleTaskPress} />}
        contentContainerStyle={filteredTasks.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              No tasks yet
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              Tap the + button to create your first workflow automation
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => router.push('/screens/CreateTaskScreen')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appTitle: { fontWeight: '800', letterSpacing: -0.5 },
  banner: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    borderRadius: 20,
  },
});
