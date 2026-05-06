import { apiRequest } from "@/lib/queryClient";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: { id: number; username: string } | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      
      login: async (username: string, password: string) => {
        try {
          const data = await apiRequest("POST", "/api/auth/login", { username, password });
          
          if (!data.token || !data.user) {
            throw new Error('Invalid response from server');
          }
          
          set({
            token: data.token,
            user: data.user,
            isAuthenticated: true,
          });
          
          return true;
        } catch (error) {
          console.error("Login failed:", error);
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
          return false;
        }
      },
      
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
      
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export const getAuthHeader = (): Record<string, string> => {
  const state = useAuthStore.getState();
  if (!state.isHydrated) {
    console.warn('Auth store not yet hydrated');
    return {};
  }
  return state.token ? { Authorization: `Bearer ${state.token}` } : {};
};

// Helper to check if user is authenticated
export const checkAuth = (): boolean => {
  const state = useAuthStore.getState();
  return state.isHydrated && state.isAuthenticated && !!state.token;
};
