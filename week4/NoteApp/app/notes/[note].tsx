import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";

type Note = {
  title: string;
  content: string;
  image_url: string | null;
};

export default function NoteDetail() {
  const { note } = useLocalSearchParams();
  const id = Array.isArray(note) ? note[0] : note;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSingleNote();
  }, [id]);

  const fetchSingleNote = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("notes")
      .select("id, title, content, image_url")
      .eq("id", id)
      .single<Note>();

    if (error || !data) {
      console.log("Error viewing note:", error?.message);
      setError("Failed to load note.");
      setLoading(false);
      return;
    }

    setTitle(data.title);
    setContent(data.content);
    setImageUrl(data.image_url);

    setLoading(false);
  };

  const handleEdit = () => {
    setEditTitle(title);
    setEditContent(content);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditContent(content);
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!id) return;

    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("notes")
      .update({
        title: editTitle.trim(),
        content: editContent.trim(),
      })
      .eq("id", id);

    if (error) {
      console.log("Update error:", error.message);
      setError("Failed to update note.");
      setSaving(false);
      return;
    }

    setTitle(editTitle.trim());
    setContent(editContent.trim());
    setIsEditing(false);
    setSaving(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b4d75" />
        <Text style={styles.loadingText}>Loading note...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={36} color="#9b4d75" />
        <Text style={styles.loadingText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchSingleNote}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Pressable
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#edcece",
                }}
                onPress={handleCancel}
              >
                <Ionicons name="close" size={22} color="#9b4d75" />
              </Pressable>
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
            </View>
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
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.noteImage} />
            ) : null}

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
  retryButton: {
    marginTop: 16,
    backgroundColor: "#edcece",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  retryText: {
    color: "#9b4d75",
    fontWeight: "700",
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
  noteImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 14,
    backgroundColor: "#edcece",
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
