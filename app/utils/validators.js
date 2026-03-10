const CATEGORIES = ['Weather', 'Reminder', 'Data Fetch'];
const TRIGGER_TYPES = ['Manual', 'Scheduled'];
const FREQUENCIES = ['Once', 'Daily', 'Weekly'];

/**
 * Validate a task form and return { isValid, errors }.
 * @param {Object} data - The form data
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateTaskForm = (data = {}) => {
  const errors = {};

  // Task name
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Task name is required.';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Task name must be at least 3 characters.';
  }

  // Description
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.description = 'Description is required.';
  }

  // Category
  if (!data.category || !CATEGORIES.includes(data.category)) {
    errors.category = 'Please select a valid category (Weather, Reminder, or Data Fetch).';
  }

  // Trigger type
  if (!data.triggerType || !TRIGGER_TYPES.includes(data.triggerType)) {
    errors.triggerType = 'Please select a valid trigger type (Manual or Scheduled).';
  }

  // Frequency
  if (!data.frequency || !FREQUENCIES.includes(data.frequency)) {
    errors.frequency = 'Please select a valid frequency (Once, Daily, or Weekly).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export { CATEGORIES, TRIGGER_TYPES, FREQUENCIES };
