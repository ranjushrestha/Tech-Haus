import { User } from "@supabase/supabase-js";
import { create } from "zustand";

type State = {
  user: User | null;
};

type Action = {
  setUserData: (user: User | null) => void;
};

export const useStore = create<State & Action>((set) => ({
  user: null,

  setUserData: (user) => set({ user }),
}));