import api from './api';

export const loginUser = async (email, password) => {
  const { data } = await api.post('/api/users/login', { email, password });
  return data;
};

export const registerUser = async (name, email, password, isAdmin) => {
  const { data } = await api.post('/api/users', { name, email, password, isAdmin });
  return data;
};

export const updateUserProfile = async (userData) => {
  const { data } = await api.put('/api/users/profile', userData);
  return data;
};