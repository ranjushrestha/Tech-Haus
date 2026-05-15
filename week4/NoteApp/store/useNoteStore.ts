
import { create } from 'zustand'

type Note={
    id:string,
    title:string,
    content:string,
    //image:
}
type NoteStore = {
    notes: Note[],
    addNote: (note:Note) => void
    updateNote: (id:string, title:string, content: string) => void,
    deleteNote: (id:string) => void,
    setNotes:(notes: Note[]) => void
}
export const useNoteStore = create <NoteStore>((set) => ({
    notes:[],
    addNote: (notes) => set((state) => ({
        notes: [notes, ...state.notes]
    })),
    updateNote: (id, title, content) => set((state) => ({
        notes: state.notes.map((note) => note.id === id ? {...note, title, content}: note)
    })),

    deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((note) => note.id !== id)
    })),
     setNotes: (notes) => set({ notes }),
     

    //addImage: 

}))