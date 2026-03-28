// src/services/api.js
import axios from 'axios';

const TOKEN_KEY = 'collective_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// ── Request Interceptor: attach JWT ──────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor: global 401 handler ─────────────────────
let logoutHandler = null;

export const registerLogoutHandler = (fn) => {
  logoutHandler = fn;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (logoutHandler) logoutHandler();
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────────
export const authService = {
  signup: async (full_name, email, password, charityId, charityPercentage) => {
    const response = await api.post('/auth/signup', { 
      full_name, 
      email, 
      password,
      charityId,
      charityPercentage 
    });
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// ── Scores ───────────────────────────────────────────────────────
export const scoreService = {
  getMyScores: async () => {
    const response = await api.get('/scores');
    return response.data;
  },
  addScore: async (scoreValue) => {
    const response = await api.post('/scores', { score: Number(scoreValue) });
    return response.data;
  },
  editScore: async (scoreId, scoreValue) => {
    const response = await api.patch(`/scores/${scoreId}`, { score: Number(scoreValue) });
    return response.data;
  },
};

// ── Charities ────────────────────────────────────────────────────
export const charityService = {
  getCharities: async () => {
    const response = await api.get('/charities');
    return response.data;
  },
  getCharity: async (id) => {
    const response = await api.get(`/charities/${id}`);
    return response.data;
  },
};

// ── Subscriptions / Stripe ───────────────────────────────────────
export const subscriptionService = {
  createCheckoutSession: async (charityId, plan) => {
    const response = await api.post('/subscriptions/create-checkout-session', { charityId, plan });
    return response.data;
  },
};

// ── Draws ────────────────────────────────────────────────────────
export const drawService = {
  getLatestDraw: async () => {
    const response = await api.get('/draw/latest');
    return response.data;
  },
  runDraw: async (mode = 'random') => {
    const response = await api.post('/draw/run', { mode });
    return response.data;
  },
  simulateDraw: async (mode = 'random') => {
    const response = await api.post('/draw/simulate', { mode });
    return response.data;
  },
};

// ── Profile ──────────────────────────────────────────────────────
export const profileService = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  updateCharityPercentage: async (percentage) => {
    const response = await api.patch('/profile/charity-percentage', { percentage });
    return response.data;
  },
  getMySubscription: async () => {
    const response = await api.get('/profile/subscription');
    return response.data;
  },
  getWinnings: async () => {
    const response = await api.get('/profile/winnings');
    return response.data;
  },
};

// ── Winners ──────────────────────────────────────────────────────
export const winnerService = {
  getWinners: async () => {
    const response = await api.get('/winners');
    return response.data;
  },
  getAllWinners: async () => {
    const response = await api.get('/winners/all');
    return response.data;
  },
  uploadProof: async (winnerId, formData) => {
    const response = await api.post(`/winners/${winnerId}/upload-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  verifyWinner: async (winnerId, status) => {
    const response = await api.patch(`/winners/${winnerId}/verify`, { status });
    return response.data;
  },
};

// ── Admin / Draw ─────────────────────────────────────────────────
export const adminService = {
  // Draw
  runDraw: async (mode = 'random') => {
    const response = await api.post('/draw/run', { mode });
    return response.data;
  },
  simulateDraw: async (mode = 'random') => {
    const response = await api.post('/draw/simulate', { mode });
    return response.data;
  },
  // Charity CRUD
  createCharity: async (charityData) => {
    const response = await api.post('/charities', charityData);
    return response.data;
  },
  updateCharity: async (id, charityData) => {
    const response = await api.put(`/charities/${id}`, charityData);
    return response.data;
  },
  deleteCharity: async (id) => {
    const response = await api.delete(`/charities/${id}`);
    return response.data;
  },
  // Winner verification
  verifyWinner: async (winnerId, decision) => {
    const response = await api.patch(`/winners/${winnerId}/verify`, decision);
    return response.data;
  },
};




export default api;
