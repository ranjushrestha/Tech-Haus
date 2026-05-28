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

      router.dismissTo("/list");
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
          <Ionicons name="arrow-back" size={22} color="#9b4d75" />
        </Pressable>

        <Text style={styles.heading}>Create Note</Text>

        <Pressable style={styles.iconButton} onPress={handleAdd}>
          {saving ? (
            <ActivityIndicator size="small" color="#9b4d75" />
          ) : (
            <Ionicons name="checkmark-circle" size={22} color="#9b4d75" />
          )}
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View style={styles.card}>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
            placeholderTextColor="#9b4d7580"
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
              <Pressable style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={22} color="#9b4d75" />
                    <Text style={styles.imageText}>Add an image</Text>
                  </View>
                )}
              </Pressable>
            </View>

            <TextInput
              placeholder="Write a note..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              style={styles.contentInput}
              placeholderTextColor="#9b4d7580"
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
    backgroundColor: "#f3dbdb",
    paddingHorizontal: 8,
    padding: "2%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  keyboardContainer: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#9b4d75",
    padding: 12,
    marginTop: 8,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#9b4d75",
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#edcece",
  },
  imageContainer: {
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 16,
  },
  imagePicker: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 20,
  },
  imagePlaceholder: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#9b4d75",
    borderStyle: "dotted",
    backgroundColor: "#edcece",
  },
  imageText: {
    color: "#9b4d75",
    fontSize: 13,
    fontWeight: "500",
  },
  titleInput: {
    borderBottomWidth: 2,
    borderColor: "#9b4d75",
    marginBottom: 18,
    paddingBottom: 6,
    fontSize: 20,
    fontWeight: "600",
    color: "#3a2a31",
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 20,
    minHeight: 220,
    color: "#3a2a31",
  },
});
