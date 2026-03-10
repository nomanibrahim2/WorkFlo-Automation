import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';

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

export default function TaskCard({ task, onPress }) {
  const theme = useTheme();

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.elevation.level2 }]}
      onPress={() => onPress?.(task)}
      mode="elevated"
    >
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            {CATEGORY_ICONS[task.category] || '📋'} {task.name}
          </Text>
          <Chip
            compact
            textStyle={styles.chipText}
            style={[styles.statusChip, { backgroundColor: STATUS_COLORS[task.status] + '22' }]}
          >
            <Text style={{ color: STATUS_COLORS[task.status], fontSize: 11, fontWeight: '700' }}>
              {task.status}
            </Text>
          </Chip>
        </View>

        <Text
          variant="bodySmall"
          numberOfLines={2}
          style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
        >
          {task.description}
        </Text>

        <View style={styles.footer}>
          <Chip compact icon="tag" textStyle={styles.categoryText} style={styles.categoryChip}>
            {task.category}
          </Chip>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ''}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontWeight: '700',
    marginRight: 8,
  },
  statusChip: {
    borderRadius: 20,
    height: 28,
  },
  chipText: {
    fontSize: 11,
  },
  description: {
    marginBottom: 10,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryChip: {
    borderRadius: 12,
    height: 28,
  },
  categoryText: {
    fontSize: 11,
  },
});
