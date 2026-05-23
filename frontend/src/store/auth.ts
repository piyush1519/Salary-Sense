import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: "developer" | "recruiter" | "admin";
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoaded: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoaded: false,
  setAuth: (token, user) => {
    localStorage.setItem("ss_token", token);
    localStorage.setItem("ss_user", JSON.stringify(user));
    set({ token, user, isLoaded: true });
  },
  logout: () => {
    localStorage.removeItem("ss_token");
    localStorage.removeItem("ss_user");
    set({ token: null, user: null, isLoaded: true });
  },
  init: () => {
    const token = localStorage.getItem("ss_token");
    const userStr = localStorage.getItem("ss_user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ token, user, isLoaded: true });
      } catch {
        set({ isLoaded: true });
      }
    } else {
      set({ isLoaded: true });
    }
  },
}));
