import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIStore {
  theme: Theme;
  sidebarCollapsed: boolean;
  detailPanelOpen: boolean;
  mobileMenuOpen: boolean;

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setDetailPanelOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarCollapsed: false,
      detailPanelOpen: false,
      mobileMenuOpen: false,

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    }),
    {
      name: 'lucy-ui',
      partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);
