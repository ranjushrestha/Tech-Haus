import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [isEditId, setIsEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function addNote() {
    if (!title.trim() || !content.trim()) return;

    if (isEditId) {
      setNotes((prev) =>
        prev.map((item) =>
          item.id === isEditId
            ? { ...item, title: title.trim(), content: content.trim() }
            : item
        )
      );
      setIsEditId(null);
    } else {
      const newNote = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
      };

      setNotes((prevNotes) => [newNote, ...prevNotes]);
    }

    setTitle("");
    setContent("");
  }

  const handleEdit = (item) => {
    setIsEditId(item.id);
    setTitle(item.title);
    setContent(item.content);
  };

  const handleView = (item) => {
    navigation.push("ViewNote", {
      note: item,
    });
  };

  const handleDelete = (item) => {
    setNotes((prev) => prev.filter((note) => note.id !== item.id));

    if (isEditId === item.id) {
      setIsEditId(null);
      setTitle("");
      setContent("");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.header}>My Notes</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={addNote}>
          <Text style={styles.buttonText}>
            {isEditId ? "Update Note" : "Save Note"}
          </Text>
        </TouchableOpacity>

        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={notes}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text numberOfLines={2}>{item.content}</Text>

              <View style={styles.actionContainer}>
                <Pressable onPress={() => handleEdit(item)}>
                  <Text style={styles.actionText}>Edit</Text>
                </Pressable>

                <Pressable onPress={() => handleView(item)}>
                  <Text style={styles.actionText}>View</Text>
                </Pressable>

                <Pressable onPress={() => handleDelete(item)}>
                  <Text style={[styles.actionText, styles.deleteText]}>
                    Delete
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  contentInput: {
    height: 100,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 30,
  },

  noteCard: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#999",
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  actionContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  actionText: {
    fontWeight: "bold",
    color: "#000",
  },

  deleteText: {
    color: "red",
  },
});