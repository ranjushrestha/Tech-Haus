import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@/store/useStore";

const Notes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);

  const user = useStore((state) => state.user);

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) return;

    if (!user) {
      console.log("User not logged in");
      return;
    }

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

    router.push("/list");
  };

  return (
    <View style={styles.container}>
      <Pressable style={{ marginLeft: 2 }} onPress={() => goBack()}>
        <Ionicons name="arrow-back" size={22} />
      </Pressable>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.heading}>Create Note</Text>
            <Pressable style={styles.checkButton} onPress={handleAdd}>
              {saving ? (
                <ActivityIndicator size="small" color="#9b4d75" />
              ) : (
                <Ionicons name="checkmark" size={28} color="#9b4d75" />
              )}
            </Pressable>
          </View>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
          />

          <TextInput
            placeholder="Content"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            style={styles.contentInput}
          />
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
    paddingHorizontal: 6,
    padding: "4%",
  },

  keyboardContainer: {
    flex: 1,
  },

  card: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#9b4d75",
    padding: 20,
    marginTop: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
