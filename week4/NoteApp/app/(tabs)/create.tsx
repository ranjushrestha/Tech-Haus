import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
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

const Notes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);
  const [noteError, setNoteError] = useState("");

  const [image, setImage] = useState<string | null>();

  const user = useStore((state) => state.user);

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) {
      setNoteError("fill all fields");
      return;
    }

    if (!user) return null;

    setSaving(true);

    const { data, error } = await supabase
      .from("notes")
      .insert({
        title: title.trim(),
        content: content.trim(),
        user_id: user.id,
      })
      .select()
      .single();

    console.log(data);

    setSaving(false);

    if (error) {
      console.log("Insert error:", error.message);
      return;
    }

    setTitle("");
    setContent("");

    Toast.show({
      type: "success",
      text1: "Note saved successfully",
      position: "top",
      visibilityTime: 1500,
    });

    router.dismissTo("/list");
  };

  async function requestPermissions() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  }

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    console.log("Image result", result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable style={{ marginLeft: 2 }} onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={28} />
        </Pressable>
        <Pressable style={styles.checkButton} onPress={handleAdd}>
          {saving ? (
            <ActivityIndicator size="small" color="#9b4d75" />
          ) : (
            <Ionicons name="checkmark" size={30} color="#9b4d75" />
          )}
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View style={styles.card}>
          <Text style={styles.heading}>Create Note</Text>

          <Text style={{ fontSize: 14, color: "red" }}>{noteError}</Text>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={(title) => {
              setNoteError("");
              setTitle(title);
            }}
            style={styles.titleInput}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                overflow: "hidden",
              }}
            >
              <Pressable
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={pickImage}
              >
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: 300,
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 20,
                      borderWidth: 4,
                      borderColor: "#9f798d",
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 100,
                      height: 80,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="image-outline" size={22} color="#9b4d75" />
                    <Text style={{ color: "#9b4d75" }}>Select an image</Text>
                  </View>
                )}
              </Pressable>
            </View>

            <TextInput
              placeholder="Content"
              value={content}
              onChangeText={(content) => {
                setNoteError("");
                setContent(content);
              }}
              multiline
              textAlignVertical="top"
              style={styles.contentInput}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Notes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
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

  checkButton: {
    padding: 8,
  },

  titleInput: {
    borderBottomWidth: 2,
    borderColor: "#9b4d75",
    marginBottom: 18,
    paddingBottom: 6,
    fontSize: 20,
    fontWeight: "600",
  },

  contentInput: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#9b4d75",
    padding: 14,
    borderRadius: 12,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
