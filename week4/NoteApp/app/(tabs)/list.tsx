import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import NoteBox from "@/components/NoteBox";
import DeleteModal from "@/components/DeleteModal";
import { useStore } from "@/store/useStore";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import { deleteNote } from "@/lib/deleteNote";
import Toast from "react-native-toast-message";

type Note = {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  user_id?: string;
  created_at?: string;
};

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useStore();

  const fetchNotes = useCallback(async () => {
    if (!user) return;

    setError(null);

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error.message);
      setError("Failed to load notes");
      setLoading(false);

      return;
    }

    setNotes(data ?? []);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes]),
  );

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (item: Note) => {
    setDeleting(true);

    const result = await deleteNote(item.id);

    if (!result.success) {
      Toast.show({
        type: "error",
        text1: "Failed to delete note",
        text2: result.error,
        visibilityTime: 1500,
      });
      setDeleting(false);
      return;
    }

    setNotes((prev) => prev.filter((n) => n.id !== item.id));
    setDeleting(false);
    setDeletingNote(null);

    Toast.show({
      type: "success",
      text1: "Note deleted",
      visibilityTime: 1500,
    });
  };

  const handleView = (item: Note) => {
    router.push({
      pathname: "/notes/[note]",
      params: {
        note: item.id,
      },
    });
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Sign out error:", error.message);
      return;
    }

    router.replace("/signIn");
  };

  const renderItem = ({ item }: { item: Note }) => {
    return (
      <Pressable onPress={() => handleView(item)} style={styles.card}>
        <View style={styles.cardContent}>
          <NoteBox item={item} />

          <DeleteModal
            visible={deletingNote?.id === item.id}
            onClose={() => {
              setDeletingNote(null);
              setDeleting(false);
            }}
            onConfirm={() => handleDelete(item)}
            noteTitle={item.title}
            loading={deleting}
          />

          <Pressable
            style={styles.deleteIconButton}
            onPress={() => setDeletingNote(item)}
          >
            <Ionicons name="trash-outline" size={20} color="#9b4270" />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#9b4d75" />
        <Text style={styles.loadingText}>Loading notes...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="alert-circle-outline" size={42} color="#9b4d75" />

        <Text style={styles.loadingText}>{error}</Text>

        <Pressable style={styles.retryButton} onPress={fetchNotes}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.heading}>My Notes</Text>
        </View>

        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={16} color="#ffffff" />
        </Pressable>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9b4d75" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes"
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <Pressable onPress={() => setSearchTerm("")}>
              <Ionicons name="close" size={20} color="#9b4d75" />
            </Pressable>
          )}
        </View>

        {filteredNotes.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {filteredNotes.length}{" "}
              {filteredNotes.length === 1 ? "note" : "notes"}
            </Text>
          </View>
        )}

        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.listContent,
            notes.length === 0 && styles.emptyListContent,
          ]}
          ListEmptyComponent={
            notes.length === 0 ? (
              <EmptyState
                emptyTitle="No notes yet!"
                emptyText="Create your note"
              />
            ) : (
              <EmptyState emptyTitle="" emptyText="no recent notes" />
            )
          }
          renderItem={renderItem}
        />
      </KeyboardAvoidingView>
      <Pressable
        style={styles.createButton}
        onPress={() => router.push("/create")}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050508",
    paddingHorizontal: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050508",
    paddingHorizontal: 20,
  },

  loadingText: {
    color: "#ccccdd",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 16,
    backgroundColor: "#9b4d75",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  retryText: {
    color: "white",
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 44,
    backgroundColor: "#12121e",
    borderWidth: 1,
    borderColor: "#2a2a44",
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#ffffff",
    paddingVertical: 0,
  },

  countBadge: {
    marginBottom: 12,
    backgroundColor: "#1a1a2e",
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    borderRadius: 999,
  },

  countText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8888bb",
  },

  listContent: {
    paddingBottom: 100,
  },

  emptyListContent: {
    flex: 1,
    justifyContent: "center",
  },

  card: {
    borderRadius: 16,
    backgroundColor: "#0a0a12",
    padding: 16,
    marginBottom: 12,
    borderTopWidth: 0.8,
    borderRightWidth: 0.8,
    borderColor: "#9b4d75",
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },

  deleteIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2d1122",
  },

  createButton: {
    position: "absolute",
    right: "46%",
    bottom: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9b4d75",
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#9b4d75",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },

  signOutButton: {
    alignItems: "center",
    gap: 6,
    backgroundColor: "#12121e",
    borderWidth: 1,
    borderColor: "#9b4d75",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },

  signOutText: {
    color: "#ccccdd",
    fontWeight: "600",
    fontSize: 13,
  },
});
