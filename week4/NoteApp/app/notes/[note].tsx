import * as FileSystem from "expo-file-system/legacy";
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
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import DeleteModal from "@/components/DeleteModal";
import { deleteNote } from "@/lib/deleteNote";

type Note = {
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

export default function NoteDetail() {
  const { note } = useLocalSearchParams();
  const id = Array.isArray(note) ? note[0] : note;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSingleNote();
  }, [id]);

  const fetchSingleNote = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("notes")
      .select("id, title, content, image_url, created_at")
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
    setCreatedAt(data.created_at);

    setLoading(false);
  };

  const handleEdit = () => {
    setEditTitle(title);
    setEditContent(content);
    setEditImage(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditContent(content);
    setEditImage(null);
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);

    const result = await deleteNote(id);

    if (!result.success) {
      Toast.show({
        type: "error",
        text1: "error deleting note",
      });
      setDeleting(false);
    }
    setDeleting(false);
    router.back();
    Toast.show({
      type: "success",
      text1: "Note deleted succesfully!",
    });
  };

  const pickNewImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission denied",
        text2: "Please allow photo access.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setEditImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (imageUri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: "base64",
      });

      const binaryStr = atob(base64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const filePath = `edit/${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from("note-images")
        .upload(filePath, bytes.buffer, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (error) {
        console.log("Upload error:", error.message);
        return null;
      }

      const { data: publicData } = supabase.storage
        .from("note-images")
        .getPublicUrl(data.path);

      return publicData.publicUrl;
    } catch (error) {
      console.log("Upload catch error:", error);
      return null;
    }
  };

  const handleUpdate = async () => {
    if (!id) return;

    setSaving(true);
    setError(null);

    let newImageUrl = imageUrl;
    if (editImage) {
      newImageUrl = await uploadImage(editImage);
    }

    const { error } = await supabase
      .from("notes")
      .update({
        title: editTitle.trim(),
        content: editContent.trim(),
        image_url: newImageUrl,
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
    setImageUrl(newImageUrl);
    setEditImage(null);
    setIsEditing(false);
    setSaving(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <View style={styles.loaderRing}>
          <ActivityIndicator size="large" color="#9b4d75" />
        </View>
        <Text style={styles.loadingText}>Loading note...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <View style={styles.errorIconWrap}>
          <Ionicons name="alert-circle-outline" size={36} color="#9b4d75" />
        </View>
        <Text style={styles.loadingText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchSingleNote}>
          <Ionicons name="refresh" size={16} color="#9b4d75" />
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* ─── Top Bar ─── */}
        <View style={styles.topBar}>
          <Pressable style={styles.topBarBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#ffffff" />
          </Pressable>

          {isEditing ? (
            <View style={styles.topBarActions}>
              <Pressable style={styles.topBarBtn} onPress={handleCancel}>
                <Ionicons name="close" size={18} color="#8888bb" />
              </Pressable>
              <Pressable
                style={[styles.topBarBtn, styles.saveBtn]}
                onPress={handleUpdate}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Ionicons name="checkmark" size={18} color="#ffffff" />
                )}
              </Pressable>
            </View>
          ) : (
            <View style={styles.topBarActions}>
              <Pressable
                style={styles.topBarBtnDanger}
                onPress={() => setShowModal(true)}
              >
                <Ionicons name="trash-outline" size={18} color="#ff4444" />
              </Pressable>
              <Pressable style={styles.topBarBtn} onPress={handleEdit}>
                <Ionicons name="pencil" size={16} color="#ffffff" />
              </Pressable>
            </View>
          )}
        </View>

        {/* ─── Content ─── */}
        {isEditing ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.editScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Note title"
              style={styles.editTitleInput}
              placeholderTextColor="#3a3a5a"
            />

            <Pressable onPress={pickNewImage} style={styles.editImageArea}>
              {editImage || imageUrl ? (
                <>
                  <Image
                    source={{ uri: editImage ?? imageUrl ?? undefined }}
                    style={styles.editImage}
                  />
                  <View style={styles.editImageOverlay}>
                    <Ionicons name="camera-outline" size={18} color="#ffffff" />
                    <Text style={styles.editImageOverlayText}>Change</Text>
                  </View>
                </>
              ) : (
                <View style={styles.editImagePlaceholder}>
                  <View style={styles.editImagePlaceholderInner}>
                    <Ionicons name="image-outline" size={28} color="#55557a" />
                    <Text style={styles.editImagePlaceholderText}>
                      Add an image
                    </Text>
                    <Text style={styles.editImagePlaceholderHint}>
                      Tap to browse
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>

            <TextInput
              value={editContent}
              onChangeText={setEditContent}
              placeholder="Start writing..."
              multiline
              textAlignVertical="top"
              style={styles.editContentInput}
              placeholderTextColor="#3a3a5a"
            />

            <View style={styles.editFooter}>
              <View style={styles.editFooterDot} />
              <Text style={styles.editFooterText}>
                {editContent.length} characters
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.viewScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <View style={styles.viewTitleSection}>
              <View style={styles.viewTitleAccent} />
              <View style={styles.viewTitleWrap}>
                <Text style={styles.viewTitle}>{title}</Text>
                {createdAt ? (
                  <Text style={styles.viewDate}>{formatDate(createdAt)}</Text>
                ) : null}
              </View>
            </View>

            {/* Image */}
            {imageUrl && (
              <View style={styles.viewImageWrap}>
                <Image source={{ uri: imageUrl }} style={styles.viewImage} />
              </View>
            )}

            {/* Content */}
            <View style={styles.viewContentSection}>
              <View style={styles.viewContentAccent} />
              <Text style={styles.viewContent}>{content}</Text>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      <DeleteModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => handleDelete(id)}
        loading={deleting}
        noteTitle={title}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050508",
  },
  flex: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050508",
    paddingHorizontal: 24,
  },
  loaderRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0a0a12",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a1a2e",
  },
  loadingText: {
    marginTop: 16,
    color: "#8888bb",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  errorIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1a0a0a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2d1122",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    backgroundColor: "#12121e",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a44",
  },
  retryText: {
    color: "#9b4d75",
    fontWeight: "600",
    fontSize: 15,
  },

  /* ─── Top Bar ─── */
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#0d0d18",
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  topBarBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12121e",
    borderWidth: 1,
    borderColor: "#1a1a2e",
  },
  topBarBtnDanger: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a0a0a",
    borderWidth: 1,
    borderColor: "#2d1111",
  },
  saveBtn: {
    backgroundColor: "#9b4d75",
    borderColor: "#9b4d75",
  },

  /* ─── View Mode ─── */
  viewScrollContent: {
    paddingBottom: 40,
  },
  viewTitleSection: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 8,
  },
  viewTitleAccent: {
    width: 5,
    borderRadius: 3,
    backgroundColor: "#9b4d75",
    marginRight: 16,
    marginTop: 4,
    flexShrink: 0,
    alignSelf: "stretch",
  },
  viewTitleWrap: {
    flex: 1,
  },
  viewTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 38,
    letterSpacing: -0.8,
  },
  viewDate: {
    marginTop: 8,
    fontSize: 12,
    color: "#4f4f63",
    fontWeight: "500",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  viewImageWrap: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  viewImage: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    backgroundColor: "#12121e",
  },
  viewContentSection: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  viewContentAccent: {
    width: 3,
    borderRadius: 2,
    backgroundColor: "#2a2a44",
    marginRight: 16,
    flexShrink: 0,
    alignSelf: "stretch",
  },
  viewContent: {
    flex: 1,
    fontSize: 16,
    lineHeight: 30,
    color: "#c8c8d4",
    letterSpacing: 0.2,
  },

  editScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  editTitleInput: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a2e",
    marginBottom: 24,
  },
  editImageArea: {
    width: "100%",
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#0a0a12",
    borderWidth: 1,
    borderColor: "#1a1a2e",
  },
  editImage: {
    width: "100%",
    height: 220,
    backgroundColor: "#12121e",
  },
  editImageOverlay: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editImageOverlayText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  editImagePlaceholder: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  editImagePlaceholderInner: {
    alignItems: "center",
    gap: 6,
  },
  editImagePlaceholderText: {
    color: "#55557a",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
  editImagePlaceholderHint: {
    color: "#3a3a5a",
    fontSize: 12,
    fontWeight: "500",
  },
  editContentInput: {
    minHeight: 300,
    fontSize: 16,
    lineHeight: 28,
    color: "#cccccc",
    textAlignVertical: "top",
    paddingHorizontal: 4,
  },
  editFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#12121e",
  },
  editFooterDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#9b4d75",
  },
  editFooterText: {
    fontSize: 12,
    color: "#4f4f63",
    fontWeight: "500",
  },
});
