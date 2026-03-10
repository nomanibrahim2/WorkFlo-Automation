/**
 * Tests for task creation logic, status transitions, and filtering.
 */

// ── Task creation helper (mirrors CreateTaskScreen logic) ────────

const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function createTask(formData) {
  if (!formData || !formData.name) throw new Error('Task name is required');
  return {
    id: generateId(),
    ...formData,
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastRunTime: null,
    lastResult: null,
  };
}

function transitionStatus(task, newStatus) {
  const validStatuses = ['Active', 'Paused', 'Completed'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }
  return { ...task, status: newStatus, updatedAt: new Date().toISOString() };
}

function filterTasks(tasks, { category = 'All', status = 'All' } = {}) {
  return tasks.filter((t) => {
    const catMatch = category === 'All' || t.category === category;
    const statusMatch = status === 'All' || t.status === status;
    return catMatch && statusMatch;
  });
}

// ── Tests ────────────────────────────────────────────────────────

describe('Task Creation', () => {
  test('creates a task with all required fields and defaults', () => {
    const task = createTask({
      name: 'Check Weather',
      description: 'Fetch current weather for Dallas',
      category: 'Weather',
      triggerType: 'Manual',
      frequency: 'Once',
    });

    expect(task.id).toBeDefined();
    expect(task.id).toMatch(/^task_/);
    expect(task.name).toBe('Check Weather');
    expect(task.status).toBe('Active');
    expect(task.createdAt).toBeDefined();
    expect(task.lastRunTime).toBeNull();
    expect(task.lastResult).toBeNull();
  });

  test('throws if name is missing', () => {
    expect(() => createTask({})).toThrow('Task name is required');
    expect(() => createTask(null)).toThrow();
  });

  test('generates unique IDs for different tasks', () => {
    const t1 = createTask({ name: 'Task A', description: 'A', category: 'Reminder', triggerType: 'Manual', frequency: 'Once' });
    const t2 = createTask({ name: 'Task B', description: 'B', category: 'Reminder', triggerType: 'Manual', frequency: 'Daily' });
    expect(t1.id).not.toBe(t2.id);
  });
});

describe('Status Transitions', () => {
  const baseTask = createTask({
    name: 'Test Task',
    description: 'desc',
    category: 'Reminder',
    triggerType: 'Manual',
    frequency: 'Once',
  });

  test('transitions from Active to Paused', () => {
    const paused = transitionStatus(baseTask, 'Paused');
    expect(paused.status).toBe('Paused');
    expect(paused.updatedAt).toBeDefined();
  });

  test('transitions from Paused to Active', () => {
    const paused = transitionStatus(baseTask, 'Paused');
    const active = transitionStatus(paused, 'Active');
    expect(active.status).toBe('Active');
  });

  test('transitions to Completed', () => {
    const completed = transitionStatus(baseTask, 'Completed');
    expect(completed.status).toBe('Completed');
  });

  test('throws on invalid status', () => {
    expect(() => transitionStatus(baseTask, 'Unknown')).toThrow('Invalid status');
  });
});

describe('Task Filtering', () => {
  const tasks = [
    createTask({ name: 'Weather 1', description: 'd', category: 'Weather', triggerType: 'Manual', frequency: 'Once' }),
    createTask({ name: 'Reminder 1', description: 'd', category: 'Reminder', triggerType: 'Scheduled', frequency: 'Daily' }),
    createTask({ name: 'Data 1', description: 'd', category: 'Data Fetch', triggerType: 'Manual', frequency: 'Weekly' }),
  ];
  // Pause the second task
  tasks[1] = transitionStatus(tasks[1], 'Paused');

  test('returns all tasks when no filter is set', () => {
    const result = filterTasks(tasks);
    expect(result).toHaveLength(3);
  });

  test('filters by category', () => {
    const result = filterTasks(tasks, { category: 'Weather' });
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('Weather');
  });

  test('filters by status', () => {
    const result = filterTasks(tasks, { status: 'Paused' });
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('Paused');
  });

  test('filters by both category and status', () => {
    const result = filterTasks(tasks, { category: 'Reminder', status: 'Paused' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Reminder 1');
  });

  test('returns empty array when no match', () => {
    const result = filterTasks(tasks, { category: 'Weather', status: 'Paused' });
    expect(result).toHaveLength(0);
  });
});
