import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "./supabase";

const getPathFromUrl = (url: string | null) => {
  if (!url) return null;
  const parts = url.split("/note-images/");
  return parts.length > 1 ? parts[1] : null;
};

export async function uploadImage(
  userId: string,
  imageUri: string,
  oldImageUrl?: string | null,
) {
  try {
    // delete old image if replacing
    const oldPath = getPathFromUrl(oldImageUrl ?? null);
    if (oldPath) {
      const { error: deleteError } = await supabase.storage
        .from("note-images")
        .remove([oldPath]);

      if (deleteError) {
        console.log("Failed to delete old image:", deleteError.message);
      }
    }

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64",
    });

    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);

    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const filePath = `${userId}/${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from("note-images")
      .upload(filePath, bytes.buffer, {
        contentType: "image/jpg",
        upsert: false,
      });

    if (error) {
      console.log("Upload error:", error.message);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from("note-images")
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  } catch (error) {
    console.log("Upload catch error", error);
    return null;
  }
}
