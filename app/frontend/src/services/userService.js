import api from './api';

// Get all users (admin only)
export const getUsers = async () => {
  const { data } = await api.get('/api/users');
  return data;
};

// Delete user (admin only)
export const deleteUser = async (id) => {
  const { data } = await api.delete(`/api/users/${id}`);
  return data;
};