import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const Notes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) return;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("User not logged in");
      return;
    }

    const { data, error } = await supabase
      .from("notes")
      .insert({
        title: title.trim(),
        content: content.trim(),
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.log("Insert error:", error.message);
      return;
    }

    console.log("Inserted note:", data);

    setTitle("");
    setContent("");

    Toast.show({
      type: "success",
      text1: "Note saved successfully",
      position: "top",
      visibilityTime: 1500,
    });

    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View style={styles.card}>
          <Text style={styles.heading}>Create Note</Text>

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

          <Pressable style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>ADD NOTE</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Notes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "8%",
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

  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#9b4d75",
    marginBottom: 20,
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