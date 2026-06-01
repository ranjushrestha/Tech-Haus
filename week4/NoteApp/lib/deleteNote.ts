import { supabase } from "./supabase";

export const deleteNote = async (id: string, url?: string | null) => {
  try {
    const filePath = url?.split("/note-images/")[1];

    if (filePath) {
      const { error } = await supabase.storage
        .from("note-images")
        .remove([filePath]);
      if (error) {
        console.log("Error deleting image:", error.message);
      }
    }

    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Error deleting note" };
  }
};
