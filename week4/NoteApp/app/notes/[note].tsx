import DeleteModal from "@/components/DeleteModal";
import { deleteNote } from "@/lib/deleteNote";
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
import Toast from "react-native-toast-message";

type Note = {
  id: string;
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
  const [deleting, setDeleting] = useState(false);

  const [showModal, setShowModal] = useState(false);

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

  const handleDelete = async (id: string) => {
    setDeleting(true);
    // const { error } = await supabase.from("notes").delete().eq("id", id);

    // if (error) {
    //   console.log("Delete error:", error.message);
    //   return;
    // }

    const result = await deleteNote(id);

    if (!result.success) {
      Toast.show({
        type: "error",
        text1: "Failed to delete note",
        text2: result.error,
        visibilityTime: 1000,
      });
      setDeleting(false);
      return;
    }

    router.back();
    setDeleting(false);
    Toast.show({
      type: "success",
      text1: "Note deleted",
      visibilityTime: 1000,
    });
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
            <Ionicons name="arrow-back" size={22} color="#9b4d75" />
          </Pressable>

          {isEditing ? (
            <View style={styles.topActions}>
              <Pressable style={styles.cancelButton} onPress={handleCancel}>
                <Ionicons name="close" size={20} color="#8888bb" />
              </Pressable>
              <Pressable
                style={styles.saveButton}
                onPress={handleUpdate}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Ionicons name="checkmark" size={22} color="#ffffff" />
                )}
              </Pressable>
            </View>
          ) : (
            <View style={styles.topActions}>
              <DeleteModal
                visible={showModal}
                onClose={() => setShowModal(!showModal)}
                onConfirm={() => handleDelete(id)}
                loading={deleting}
                noteTitle={title}
              />

              <Pressable
                style={styles.iconButton}
                onPress={() => setShowModal(true)}
              >
                <Ionicons name="trash-outline" size={20} color="#9b4d75" />
              </Pressable>

              <Pressable style={styles.editButton} onPress={() => handleEdit()}>
                <Ionicons name="create-outline" size={20} color="#ffffff" />
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.card}>
          {isEditing ? (
            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Title"
              style={styles.titleInput}
              placeholderTextColor="#3a3a5c"
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
                placeholderTextColor="#3a3a5c"
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
    paddingHorizontal: 12,
    backgroundColor: "#050508",
  },
  keyboardContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050508",
  },
  loadingText: {
    marginTop: 12,
    color: "#9b4d75",
    fontSize: 18,
    fontWeight: "600",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#12121e",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a44",
  },
  retryText: {
    color: "#9b4d75",
    fontWeight: "700",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.3,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12121e",
    borderWidth: 1,
    borderColor: "#2a2a44",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9b4d75",
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12121e",
    borderWidth: 1,
    borderColor: "#2a2a44",
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9b4d75",
  },
  card: {
    flex: 1,
    backgroundColor: "#0a0a12",
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#9b4d75",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    paddingBottom: 14,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a44",
    letterSpacing: -0.5,
  },
  titleInput: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a44",
    paddingBottom: 14,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 40,
  },
  noteImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "#12121e",
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: "#ccccdd",
  },
  contentInput: {
    minHeight: 350,
    fontSize: 16,
    lineHeight: 26,
    color: "#ccccdd",
    textAlignVertical: "top",
  },
});
