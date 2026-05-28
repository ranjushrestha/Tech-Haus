import { supabase } from "./supabase";

export const deleteNote = async (id: string, imageUrl?: string | null) => {
  try {
    if (imageUrl) {
      const bucketName = "note-images";
      const pathStart = imageUrl.indexOf(`/object/public/${bucketName}/`);
      if (pathStart !== -1) {
        const imagePath = imageUrl.substring(
          pathStart + `/object/public/${bucketName}/`.length,
        );
        await supabase.storage.from(bucketName).remove([imagePath]);
      }
    }

    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete note" };
  }
};
