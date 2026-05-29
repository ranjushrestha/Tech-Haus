import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@/store/useStore";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const user = useStore((state) => state.user);

  // Step 1: Ask for permission to access the photo libraryr
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  };

  // Step 2: Open the image picker and store the local URI
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Toast.show({
        type: "error",
        text1: "Permission denied",
        text2: "Please allow photo access to add an image.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      // This is a local file URI like: file:///var/mobile/.../photo.jpg
      setImage(result.assets[0].uri);
    }
  };

  // Step 3: Upload image to Supabase Storage, return the public URL
  const uploadImage = async (userId: string, imageUri: string) => {
    try {
      // Read the local file as a base64 string (React Native safe approach)
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: "base64",
      });

      // Convert base64 string → raw binary bytes (ArrayBuffer)
      // This is required because FormData/Blob don't work properly in React Native
      const binaryStr = atob(base64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      // File path inside the bucket: userId/timestamp.jpg
      const filePath = `${userId}/${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from("note-images")
        .upload(filePath, bytes.buffer, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (error) {
        console.log("Upload error:", error.message);
        return null;
      }

      // Get the permanent public URL for the uploaded file
      const { data: publicData } = supabase.storage
        .from("note-images")
        .getPublicUrl(data.path);

      return publicData.publicUrl;
    } catch (error) {
      console.log("Upload catch error:", error);
      return null;
    }
  };

  // Step 4: Save the note (upload image first if one was picked, then insert note)
  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing fields",
        text2: "Please add both title and content.",
      });
      return;
    }

    if (!user) return;

    setSaving(true);

    try {
      let imageUrl: string | null = null;

      if (image) {
        imageUrl = await uploadImage(user.id, image);
      }

      const { data, error } = await supabase
        .from("notes")
        .insert({
          title: title.trim(),
          content: content.trim(),
          user_id: user.id,
          image_url: imageUrl, // null if no image was picked
        })
        .select()
        .single();

      if (error) {
        console.log("Insert error:", error.message);
        Toast.show({
          type: "error",
          text1: "Save failed",
          text2: error.message,
        });
        return;
      }

      console.log("Created note:", data);

      setTitle("");
      setContent("");
      setImage(null);

      Toast.show({
        type: "success",
        text1: "Note saved successfully",
        position: "top",
        visibilityTime: 1000,
      });

      router.back();
    } catch (error) {
      console.log("Save note error:", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </Pressable>

        <Text style={styles.heading}>New Note</Text>

        <Pressable
          style={[styles.iconButton, styles.saveButton]}
          onPress={handleAdd}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="checkmark" size={22} color="#ffffff" />
          )}
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <TextInput
              placeholder="Note title"
              value={title}
              onChangeText={setTitle}
              style={styles.titleInput}
              placeholderTextColor="#55557a"
            />

            <Pressable style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={20} color="#55557a" />
                  <Text style={styles.imageText}>Add photo</Text>
                </View>
              )}
            </Pressable>

            <TextInput
              placeholder="Start writing..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              style={styles.contentInput}
              placeholderTextColor="#55557a"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateNote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050508",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2e",
  },
  keyboardContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    borderColor: "#1a1a2e",
    backgroundColor: "#0a0a12",
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12121e",
    borderWidth: 1,
    borderColor: "#2a2a44",
  },
  saveButton: {
    backgroundColor: "#9b4d75",
    borderColor: "#9b4d75",
  },
  imagePicker: {
    width: "100%",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a44",
    borderStyle: "dashed",
    backgroundColor: "#12121e",
    flexDirection: "row",
  },
  imageText: {
    color: "#55557a",
    fontSize: 14,
    fontWeight: "500",
  },
  titleInput: {
    borderBottomWidth: 1,
    borderColor: "#2a2a44",
    marginBottom: 20,
    paddingBottom: 12,
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
  },
  contentInput: {
    minHeight: 280,
    fontSize: 15,
    lineHeight: 24,
    color: "#cccccc",
    textAlignVertical: "top",
  },
});
