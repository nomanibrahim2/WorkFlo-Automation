import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, useTheme, SegmentedButtons, Text } from 'react-native-paper';
import { validateTaskForm, CATEGORIES, TRIGGER_TYPES, FREQUENCIES } from '../utils/validators';

export default function TaskForm({ initialData, onSubmit, onCancel }) {
  const theme = useTheme();
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    triggerType: '',
    frequency: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        triggerType: initialData.triggerType || '',
        frequency: initialData.frequency || '',
      });
    }
  }, [initialData]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    const { isValid, errors: validationErrors } = validateTaskForm(form);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    onSubmit?.(form);
  };

  const renderSelector = (label, field, options) => (
    <View style={styles.fieldGroup}>
      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
        {label}
      </Text>
      <SegmentedButtons
        value={form[field]}
        onValueChange={(v) => update(field, v)}
        buttons={options.map((o) => ({ value: o, label: o }))}
        style={styles.segmented}
      />
      {errors[field] ? (
        <HelperText type="error" visible>{errors[field]}</HelperText>
      ) : null}
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        label="Task Name"
        value={form.name}
        onChangeText={(v) => update('name', v)}
        mode="outlined"
        error={!!errors.name}
        style={styles.input}
      />
      {errors.name ? <HelperText type="error" visible>{errors.name}</HelperText> : null}

      <TextInput
        label="Description"
        value={form.description}
        onChangeText={(v) => update('description', v)}
        mode="outlined"
        multiline
        numberOfLines={3}
        error={!!errors.description}
        style={styles.input}
      />
      {errors.description ? <HelperText type="error" visible>{errors.description}</HelperText> : null}

      {renderSelector('Category', 'category', CATEGORIES)}
      {renderSelector('Trigger Type', 'triggerType', TRIGGER_TYPES)}
      {renderSelector('Frequency', 'frequency', FREQUENCIES)}

      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.btn}
          textColor={theme.colors.onSurface}
        >
          Cancel
        </Button>
        <Button mode="contained" onPress={handleSubmit} style={styles.btn}>
          {isEdit ? 'Update Task' : 'Create Task'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  input: { marginBottom: 4 },
  fieldGroup: { marginTop: 12, marginBottom: 4 },
  label: { marginBottom: 8, fontWeight: '600' },
  segmented: { marginBottom: 2 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    gap: 12,
  },
  btn: { flex: 1, borderRadius: 12 },
});
