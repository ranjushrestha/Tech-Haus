import { router } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Note = {
  id: string;
  title: string;
  content: string;
};

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isEditId, setIsEditId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!title.trim() || !content.trim()) return;

    if (isEditId) {
      setNotes((prev) =>
        prev.map((item) =>
          item.id === isEditId
            ? {
                ...item,
                title: title.trim(),
                content: content.trim(),
              }
            : item,
        ),
      );

      setIsEditId(null);
      setTitle("");
      setContent("");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
    };

    setNotes((prevNotes) => [newItem, ...prevNotes]);

    setTitle("");
    setContent("");
  };

  const handleEdit = (item: Note) => {
    setIsEditId(item.id);
    setTitle(item.title);
    setContent(item.content);
  };

  const handleDelete = (item: Note) => {
    setNotes((prev) => prev.filter((note) => note.id !== item.id));

    if (isEditId === item.id) {
      setIsEditId(null);
      setTitle("");
      setContent("");
    }
  };

  const handleView = (item: Note) => {
    router.push({
      pathname: "/notes/[note]",
      params: {
        id: item.id,
        title: item.title,
        content: item.content,
      },
    });
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
              {isEditId ? "UPDATE NOTE" : "ADD NOTE"}
            </Text>
          </Pressable>

          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.noteCard}>
                <View>
                  <Text style={styles.noteTitle}>{item.title}</Text>
                  <Text style={styles.noteContent}>{item.content}</Text>
                </View>

                <View style={styles.actionButton}>
                  <Pressable onPress={() => handleEdit(item)}>
                    <Text>Edit</Text>
                  </Pressable>

                  <Pressable onPress={() => handleView(item)}>
                    <Text>View</Text>
                  </Pressable>

                  <Pressable onPress={() => handleDelete(item)}>
                    <Text style={{ color: "red" }}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
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
