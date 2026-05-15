import { supabase } from "@/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
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
import Toast from 'react-native-toast-message' 



const Notes = () => {

  const {id} = useLocalSearchParams()

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
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>My Notes</Text>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Content"
            value={content}
            onChangeText={setContent}
            multiline
            style={[styles.input, styles.contentInput]}
          />

          <Pressable style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>
            ADD NOTE
            </Text>
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
  },

  keyboardContainer: {
    flex: 1,
  },

  innerContainer: {
    flex: 1,
    padding: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },

  contentInput: {
    height: 120,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "black",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  noteCard: {
    backgroundColor: "#f5f5f5",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  noteContent: {
    fontSize: 15,
    color: "#444",
  },

  actionButton: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
});
