import { User } from "@supabase/supabase-js";
import { create } from "zustand";

type State = {
  user: User | null;
  authLoading: boolean;
};

type Action = {
  setUserData: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
};

export const useStore = create<State & Action>((set) => ({
  user: null,
  authLoading: true,

  setUserData: (user) => set({ user }),
  setAuthLoading: (loading) => set({ authLoading: loading }),
}));
