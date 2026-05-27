import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoteDetail() {
  const { note } = useLocalSearchParams();
  const id = Array.isArray(note) ? note[0] : note;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  //fetch single note when id changes
  useEffect(() => {
    fetchSingleNote();
  }, [id]);

  const fetchSingleNote = async () => {
    if (!id) return;
    // set loading true as it takes time for data to load from db
    setLoading(true);

    //get single note with specific id from db
    const { data, error } = await supabase
      .from("notes")
      .select("id, title, content")
      .eq("id", id)
      .single();

    if (error) {
      console.log("Error viewing note:", error.message);
      setLoading(false);
      return;
    }

    // set title from the retunred data
    setTitle(data.title);
    setContent(data.content);

    setLoading(false);
  };
  // transfer data to TextInput
  const handleEdit = () => {
    setEditTitle(title);
    setEditContent(content);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!id) return;

    setSaving(true);

    //send data to db with updated title and content
    const { error } = await supabase
      .from("notes")
      .update({
        title: editTitle.trim(),
        content: editContent.trim(),
      })
      .eq("id", id);

    if (error) {
      console.log("Update error:", error.message);
      setSaving(false);
      return;
    }

    //update ui with new data
    setTitle(editTitle.trim());
    setContent(editContent.trim());

    setIsEditing(false);
    setSaving(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b4d75" />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#9b4d75" />
          </Pressable>

          {isEditing ? (
            <Pressable
              style={styles.checkButton}
              onPress={handleUpdate}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#9b4d75" />
              ) : (
                <Ionicons name="checkmark-circle" size={28} color="#9b4d75" />
              )}
            </Pressable>
          ) : (
            <Pressable style={styles.checkButton} onPress={handleEdit}>
              <Ionicons name="create-outline" size={22} color="#9b4d75" />
            </Pressable>
          )}
        </View>

        <View style={styles.card}>
          {isEditing ? (
            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Title"
              style={styles.titleInput}
            />
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {isEditing ? (
              <TextInput
                value={editContent}
                onChangeText={setEditContent}
                placeholder="Content"
                multiline
                textAlignVertical="top"
                style={styles.contentInput}
              />
            ) : (
              <Text style={styles.content}>{content}</Text>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: "#f3dbdb",
  },
  keyboardContainer: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3dbdb",
  },

  loadingText: {
    marginTop: 12,
    color: "#9b4d75",
    fontSize: 18,
    fontWeight: "600",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#edcece",
  },

  checkButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#edcece",
  },

  card: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#9b4d75",
    padding: 20,
    marginTop: 16,
    marginHorizontal: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2f2f2f",
    borderBottomWidth: 1,
    borderBottomColor: "#9b4d75",
    paddingBottom: 12,
    marginBottom: 12,
  },

  titleInput: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2f2f2f",
    borderBottomWidth: 1,
    borderBottomColor: "#9b4d75",
    paddingBottom: 12,
    marginBottom: 12,
  },

  scrollContent: {
    paddingTop: 10,
    paddingBottom: 30,
  },

  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },

  contentInput: {
    minHeight: 350,
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
});
