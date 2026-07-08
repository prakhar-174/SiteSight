import { create } from 'zustand';

interface ThemeStore {
  theme: 'light' | 'dark';
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  toggle: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
}));
