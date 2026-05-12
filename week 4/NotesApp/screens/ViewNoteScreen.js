import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ViewNoteScreen = ({ route, navigation }) => {
  const { note, setNotes } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = () => {
    
    setNotes((prev) =>
      prev.map((item) =>
        item.id === note.id
          ? {
              ...item,
              title: title.trim(),
              content: content.trim(),
            }
          : item
      )
    );

    setIsEditing(false);
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </Pressable>

        <Pressable onPress={isEditing ? handleSave : () => setIsEditing(true)}>
          <Text style={styles.editButton}>
            {isEditing ? "Save" : "Edit"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.wrapper}>
        <View style={styles.card}>
          {isEditing ? (
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.titleInput}
              placeholder="Title"
            />
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}

          

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {isEditing ? (
              <TextInput
                value={content}
                onChangeText={setContent}
                style={styles.contentInput}
                placeholder="Content"
                multiline
                textAlignVertical="top"
              />
            ) : (
              <Text style={styles.content}>{content}</Text>
            )}
          </ScrollView>

        
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ViewNoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  backButton: {
    fontSize: 16,
    fontWeight: "600",
  },

  editButton: {
    fontSize: 16,
    fontWeight: "700",
    color: "#a68fdc",
  },

  wrapper: {
    flex: 1,
    padding: 20,
  },

  card: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },

  titleInput: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 4,
  },


  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 20,
  },

  content: {
    fontSize: 18,
    lineHeight: 30,
    color: "#333",
  },

  contentInput: {
    fontSize: 18,
    lineHeight: 30,
    color: "#333",
    minHeight: 300,
  },

  deleteButton: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});