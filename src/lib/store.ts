import { create } from 'zustand';
import apiClient from '../services/apiClient';

interface User {
  id: string;
  name: string;
  role: string;
  district: string;
  state: string;
}

interface WalletResponse {
  wallet_balance: number;
}

interface AppState {
  user: User | null;
  token: string | null;
  walletBalance: number;
  records: any[];
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  fetchWallet: () => Promise<void>;
  fetchRecords: () => Promise<void>;
  logout: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  walletBalance: 0,
  records: [],
  isLoading: false,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ token });
  },

  fetchWallet: async () => {
    try {
      const res = await apiClient.get<WalletResponse>('/citizen/wallet');
      set({ walletBalance: res.data.wallet_balance });
    } catch (err) {
      console.error("Wallet fetch error:", err);
    }
  },

  fetchRecords: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get<Record<string, unknown>[]>('/history');
      set({ records: res.data });
    } catch (err) {
      console.error("Records fetch error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/logout');
    } catch (e) {}
    localStorage.removeItem('token');
    set({ user: null, token: null, walletBalance: 0, records: [] });
  }
}));
