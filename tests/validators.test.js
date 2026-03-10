/**
 * Tests for form validation logic.
 */
const { validateTaskForm, CATEGORIES, TRIGGER_TYPES, FREQUENCIES } = require('../app/utils/validators');

describe('validateTaskForm', () => {
  const validData = {
    name: 'Weather Check',
    description: 'Fetch daily weather for Dallas, TX',
    category: 'Weather',
    triggerType: 'Manual',
    frequency: 'Once',
  };

  test('passes with valid data', () => {
    const { isValid, errors } = validateTaskForm(validData);
    expect(isValid).toBe(true);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  test('fails when name is empty', () => {
    const { isValid, errors } = validateTaskForm({ ...validData, name: '' });
    expect(isValid).toBe(false);
    expect(errors.name).toBeDefined();
  });

  test('fails when name is too short', () => {
    const { isValid, errors } = validateTaskForm({ ...validData, name: 'AB' });
    expect(isValid).toBe(false);
    expect(errors.name).toContain('at least 3 characters');
  });

  test('fails when description is empty', () => {
    const { isValid, errors } = validateTaskForm({ ...validData, description: '' });
    expect(isValid).toBe(false);
    expect(errors.description).toBeDefined();
  });

  test('fails when category is invalid', () => {
    const { isValid, errors } = validateTaskForm({ ...validData, category: 'Invalid' });
    expect(isValid).toBe(false);
    expect(errors.category).toBeDefined();
  });

  test('fails when triggerType is invalid', () => {
    const { isValid, errors } = validateTaskForm({ ...validData, triggerType: 'Auto' });
    expect(isValid).toBe(false);
    expect(errors.triggerType).toBeDefined();
  });

  test('fails when frequency is invalid', () => {
    const { isValid, errors } = validateTaskForm({ ...validData, frequency: 'Monthly' });
    expect(isValid).toBe(false);
    expect(errors.frequency).toBeDefined();
  });

  test('returns all errors when no fields are provided', () => {
    const { isValid, errors } = validateTaskForm({});
    expect(isValid).toBe(false);
    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(5);
  });

  test('returns errors for undefined input', () => {
    const { isValid, errors } = validateTaskForm();
    expect(isValid).toBe(false);
    expect(errors.name).toBeDefined();
  });

  test('trims whitespace-only name', () => {
    const { isValid, errors } = validateTaskForm({ ...validData, name: '   ' });
    expect(isValid).toBe(false);
    expect(errors.name).toBeDefined();
  });
});

describe('Constants', () => {
  test('CATEGORIES has expected values', () => {
    expect(CATEGORIES).toEqual(['Weather', 'Reminder', 'Data Fetch']);
  });

  test('TRIGGER_TYPES has expected values', () => {
    expect(TRIGGER_TYPES).toEqual(['Manual', 'Scheduled']);
  });

  test('FREQUENCIES has expected values', () => {
    expect(FREQUENCIES).toEqual(['Once', 'Daily', 'Weekly']);
  });
});
