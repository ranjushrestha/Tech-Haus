import { supabase } from "./supabase";

export const deleteNote = async (id: string) => {
  try {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete note" };
  }
};
