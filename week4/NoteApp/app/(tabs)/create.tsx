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
import * as ImagePicker from "expo-image-picker";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const user = useStore((state) => state.user);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  };

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (userId: string, imageUri: string) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const filePath = `${userId}/${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from("note-images")
        .upload(filePath, blob, {
          contentType: "image/jpeg",
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
      console.log("Upload catch error:", error);
      return null;
    }
  };

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
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) {
        console.log("Insert error:", error.message);
        Toast.show({
          type: "error",
          text1: "Save failed",
          text2: error.message,
          visibilityTime: 1500,
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
        visibilityTime: 1500,
      });

      router.dismissTo("/list");
    } catch (error) {
      console.log("Save note error:", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again.",
        visibilityTime: 15000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#9b4d75" />
        </Pressable>

        <Text style={styles.heading}>Create Note</Text>

        <Pressable style={styles.saveButton} onPress={handleAdd}>
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
        <View style={styles.formArea}>
          <View style={styles.titleSection}>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.titleInput}
              placeholderTextColor="#3a3a5c"
            />
          </View>

          <View style={styles.imageContainer}>
            <Pressable style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={28} color="#55557a" />
                  <Text style={styles.imageText}>Add image</Text>
                </View>
              )}
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.contentScroll}
          >
            <TextInput
              placeholder="Write a note..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              style={styles.contentInput}
              placeholderTextColor="#3a3a5c"
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateNote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050508",
    paddingHorizontal: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 20,
  },
  keyboardContainer: {
    flex: 1,
  },
  formArea: {
    flex: 1,
    backgroundColor: "#0a0a12",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#9b4d75",
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12121e",
    borderWidth: 1,
    borderColor: "#2a2a44",
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9b4d75",
  },
  titleSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a44",
    marginBottom: 20,
    paddingBottom: 4,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    paddingVertical: 8,
    letterSpacing: -0.3,
  },
  imageContainer: {
    marginBottom: 20,
  },
  imagePicker: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 16,
  },
  imagePlaceholder: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#9b4d75",
    borderStyle: "dashed",
    backgroundColor: "#12121e",
  },
  imageText: {
    color: "#55557a",
    fontSize: 14,
    fontWeight: "500",
  },
  contentScroll: {
    flex: 1,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: "top",
    color: "#ccccdd",
    paddingTop: 0,
    minHeight: 200,
  },
});
