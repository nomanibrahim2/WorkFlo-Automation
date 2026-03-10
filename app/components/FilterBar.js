import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Chip, useTheme, Text } from 'react-native-paper';

const CATEGORIES = ['All', 'Weather', 'Reminder', 'Data Fetch'];
const STATUSES = ['All', 'Active', 'Paused', 'Completed'];

export default function FilterBar({ selectedCategory, selectedStatus, onFilterChange }) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text variant="labelSmall" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
        Category
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            selected={selectedCategory === cat}
            onPress={() => onFilterChange?.(cat, selectedStatus)}
            style={styles.chip}
            compact
            mode={selectedCategory === cat ? 'flat' : 'outlined'}
          >
            {cat}
          </Chip>
        ))}
      </ScrollView>

      <Text variant="labelSmall" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
        Status
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {STATUSES.map((st) => (
          <Chip
            key={st}
            selected={selectedStatus === st}
            onPress={() => onFilterChange?.(selectedCategory, st)}
            style={styles.chip}
            compact
            mode={selectedStatus === st ? 'flat' : 'outlined'}
          >
            {st}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    borderRadius: 20,
  },
});
