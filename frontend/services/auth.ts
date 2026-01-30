import api from '@/utils/api';
import Cookies from 'js-cookie';

// REGISTER
export const registerUser = async (userData: { username: string; email: string; password: string }) => {
  try {
    const response = await api.post('users/register/', userData); // leading slash is important
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message || "Registration failed";
    }
    // Handle specific API error structure from backend if known, but for now 'unknown' + generic handling
    const err = error as any; // Safe cast for legacy structure access if needed, or better:

    if (err.response && err.response.data) {
      const data = err.response.data;
      const firstKey = Object.keys(data)[0];
      if (firstKey && Array.isArray(data[firstKey])) {
        throw `${firstKey}: ${data[firstKey][0]}`;
      }
      throw JSON.stringify(data);
    }
    throw "Registration failed";
  }
};

// LOGIN
export const loginUser = async (userData: { username: string; password: string }) => {
  try {
    const response = await api.post('users/login/', userData);
    Cookies.set('token', response.data.access, { expires: 1 });
    Cookies.set('username', userData.username, { expires: 1 });
    return response.data;
  } catch (error: unknown) {
    const err = error as any;
    throw err.response?.data?.detail || "Login failed";
  }
};

// LOGOUT
export const logoutUser = () => {
  Cookies.remove('token');
  Cookies.remove('username');
  window.location.href = '/login';
};

// GET USERNAME
export const getUsername = (): string | undefined => {
  return Cookies.get('username');
};
