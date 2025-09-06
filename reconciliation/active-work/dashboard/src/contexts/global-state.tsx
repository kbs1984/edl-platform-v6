'use client';

import { create } from 'zustand';

interface GlobalState {
  user: {
    id: string;
    emcoinBalance: number;
    achievementCount: number;
    activityCount: number;
    streak: number;
    lastLogin: Date | null;
    todayVisitors: number;
  };
  updateUser: (updates: Partial<GlobalState['user']>) => void;
  updateBalance: (balance: number) => void;
  updateStreak: (streak: number) => void;
  updateAchievements: (count: number) => void;
  updateVisitors: (count: number) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  user: { 
    id: '', 
    emcoinBalance: 0, 
    achievementCount: 0, 
    activityCount: 0,
    streak: 0,
    lastLogin: null,
    todayVisitors: 0
  },
  updateUser: (updates) => set((state) => ({
    user: { ...state.user, ...updates }
  })),
  updateBalance: (balance) => set((state) => ({
    user: { ...state.user, emcoinBalance: balance }
  })),
  updateStreak: (streak) => set((state) => ({
    user: { ...state.user, streak }
  })),
  updateAchievements: (count) => set((state) => ({
    user: { ...state.user, achievementCount: count }
  })),
  updateVisitors: (count) => set((state) => ({
    user: { ...state.user, todayVisitors: count }
  }))
}));