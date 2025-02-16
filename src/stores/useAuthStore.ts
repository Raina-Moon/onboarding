import { create } from "zustand";
import { QueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  nickname: string;
  profile_img: string | null;
  introduction: string | null;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: (queryClient: QueryClient) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: (queryClient) => {
    localStorage.removeItem("accessToken");
    set({ user: null });

    queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    queryClient.removeQueries({ queryKey: ["userInfo"] });
  },
}));
