import { create } from "zustand"

type Theme = "dark" | "light"

interface UIState {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  theme: Theme
}

interface UIActions {
  toggleMobileMenu: () => void
  setMobileMenuOpen: (isOpen: boolean) => void
  toggleSearch: () => void
  setSearchOpen: (isOpen: boolean) => void
  setTheme: (theme: Theme) => void
}

type UIStore = UIState & UIActions

export const useUIStore = create<UIStore>()((set, get) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  theme: "dark",

  toggleMobileMenu: () => set({ isMobileMenuOpen: !get().isMobileMenuOpen }),

  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

  toggleSearch: () => set({ isSearchOpen: !get().isSearchOpen }),

  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

  setTheme: (theme) => set({ theme }),
}))
