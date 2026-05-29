import { supabase } from "./supabase";

export const deleteNote = async (id: string) => {
  try {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { sucess: true };
  } catch (err: any) {
    return { sucess: false, error: err.message || "Error deleting note" };
  }
};
