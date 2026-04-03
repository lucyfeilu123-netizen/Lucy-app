import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light' | 'pink' | 'red' | 'green';
type Locale = 'en' | 'zh-TW' | 'es';

interface UIStore {
  theme: Theme;
  sidebarCollapsed: boolean;
  detailPanelOpen: boolean;
  mobileMenuOpen: boolean;

  locale: Locale;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  toggleSidebar: () => void;
  setDetailPanelOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      locale: 'en' as Locale,
      sidebarCollapsed: false,
      detailPanelOpen: false,
      mobileMenuOpen: false,

      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    }),
    {
      name: 'lucy-ui',
      partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed, locale: state.locale }),
    }
  )
);
