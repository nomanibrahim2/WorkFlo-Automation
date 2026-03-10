import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@workflo_tasks';
const THEME_KEY = '@workflo_theme';
const AUTH_TOKEN_KEY = '@workflo_auth_token';
const USER_KEY = '@workflo_user';

// ── Generic helpers ──────────────────────────────────────────────

export const getItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error('Storage getItem error:', e);
    return null;
  }
};

export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage setItem error:', e);
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Storage removeItem error:', e);
  }
};

// ── Task persistence ─────────────────────────────────────────────

export const getAllTasks = async () => {
  return (await getItem(TASKS_KEY)) || [];
};

export const saveAllTasks = async (tasks) => {
  await setItem(TASKS_KEY, tasks);
};

export const saveTask = async (task) => {
  const tasks = await getAllTasks();
  const idx = tasks.findIndex((t) => t.id === task.id);
  if (idx >= 0) {
    tasks[idx] = { ...tasks[idx], ...task };
  } else {
    tasks.unshift(task);
  }
  await saveAllTasks(tasks);
  return tasks;
};

export const deleteTask = async (taskId) => {
  const tasks = await getAllTasks();
  const filtered = tasks.filter((t) => t.id !== taskId);
  await saveAllTasks(filtered);
  return filtered;
};

// ── Theme persistence ────────────────────────────────────────────

export const getTheme = async () => {
  return (await getItem(THEME_KEY)) || 'dark';
};

export const setTheme = async (mode) => {
  await setItem(THEME_KEY, mode);
};

// ── Auth token persistence ───────────────────────────────────────

export const getAuthToken = async () => getItem(AUTH_TOKEN_KEY);
export const setAuthToken = async (token) => setItem(AUTH_TOKEN_KEY, token);
export const removeAuthToken = async () => removeItem(AUTH_TOKEN_KEY);

export const getUser = async () => getItem(USER_KEY);
export const setUser = async (user) => setItem(USER_KEY, user);
export const removeUser = async () => removeItem(USER_KEY);
