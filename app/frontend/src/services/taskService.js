import api from './api';

// Get user tasks
export const getUserTasks = async () => {
  const { data } = await api.get('/api/tasks');
  return data;
};

// Get all tasks (admin only)
export const getAllTasks = async () => {
  const { data } = await api.get('/api/tasks/all');
  return data;
};

// Create task
export const createTask = async (taskData) => {
  const { data } = await api.post('/api/tasks', taskData);
  return data;
};

// Get task by ID
export const getTaskById = async (id) => {
  const { data } = await api.get(`/api/tasks/${id}`);
  return data;
};

// Update task
export const updateTask = async (id, taskData) => {
  const { data } = await api.put(`/api/tasks/${id}`, taskData);
  return data;
};

// Delete task
export const deleteTask = async (id) => {
  const { data } = await api.delete(`/api/tasks/${id}`);
  return data;
};