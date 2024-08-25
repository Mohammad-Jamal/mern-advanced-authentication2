import axios from 'axios';
import {create} from 'zustand';

const API_URL = 'http://localhost:3000/api/auth';
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user:null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isCheckingAuth:false,
  message: null,

  signup: async(email,password,name) => {
    set({isLoading: true, error: null});
    try {
      const response = await axios.post(`${API_URL}/signup`,{email,password,name});
      set({ user: response.data.user, isAuthenticated: true,isLoading: false,});

    } catch(error) {
      set({error: error.response.data.message || 'Error Signing up', isLoading : false});
      throw error;
    }
  },

  login: async(email,password) => {
    set({isLoading: true, error: null});
    try {
      const response = await axios.post(`${API_URL}/login`,{email,password});
      set({user: response.data.user, isAuthenticated: true, isLoading:false,error: null});
    } catch(error) {
      set({error: error.response?.data?.message || 'Error logging in', isLoading: false});
      throw error;
    }
  },

  logout: async() => {
    set({isLoading: true, error: null});
    try {
      const response = await axios.post(`${API_URL}/logout`);
      set({user:null, isAuthenticated: false, isLoading:false, error: null});
    } catch(error) {
      set({error: 'Error Logging Out',isLoading: false});
      throw error;

    }
  },

  verifyEmail: async(code) => {
    set({isLoading: true, error: null});
    try {
      const response = await axios.post(`${API_URL}/verify-email`,{code});
      set({user: response.data.user, isAuthenticated: true, isLoading: false});
      return response.data;
    } catch(error) {
      set({error: error.response.data.message || 'Error verifying email', isLoading: false});
      throw error;
    }
  },

  checkAuth: async() => {
    set({isCheckingAuth:true, error: null});
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({user: response.data.user, isAuthenticated: true,isCheckingAuth: false});
    } catch(error) {
      set({error: null, isCheckingAuth: false});
    }
  },

  forgotPassword: async(email) => {
    set({isLoading: true, error: null});
    try {
      const response = await axios.post(`${API_URL}/forgot-password`,{email});
      set({message: response.data.message, isLoading: false});
    } catch(error) {
      set({isLoading : false, error: error.response.data.message || 'Error sending reset password email link'});
      throw error;
    }
  },

  resetPassword: async(token, password) => {
    set({isLoading: true, error: null});
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`,{password});
      set({message: response.data.message, isLoading: false});
    } catch(error)  {
      set({isLoading: false, error: error.response.data.message || 'Error resetting password'});
      throw error;
    }
  }
}))