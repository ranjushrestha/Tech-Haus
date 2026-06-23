import { User } from "@supabase/supabase-js";
import { create } from "zustand";

export type Folder = {
  id: string;
  name: string;
  icon: string;
  noteCount: number;
  createdAt: string;
};

type State = {
  user: User | null;
  authLoading: boolean;
  folders: Folder[];
  selectedFolder: Folder | null;
};

type Action = {
  setUserData: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Folder) => void;
  removeFolder: (id: string) => void;
  setSelectedFolder: (folder: Folder | null) => void;
};

export const useStore = create<State & Action>((set) => ({
  user: null,
  authLoading: true,
  folders: [],
  selectedFolder: null,

  setUserData: (user) => set({ user }),
  setAuthLoading: (loading) => set({ authLoading: loading }),
  setFolders: (folders) => set({ folders }),
  addFolder: (folder) =>
    set((state) => ({ folders: [...state.folders, folder] })),
  removeFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
    })),
  setSelectedFolder: (folder) => set({ selectedFolder: folder }),
}));
