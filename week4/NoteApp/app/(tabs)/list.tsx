import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useStore();

  // Fetch all notes for the logged-in user, ordered newest first
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

  // Re-fetch notes every time this screen comes into focus
  // (covers the case where a note was created or edited)
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes]),
  );

  //refresh on pull
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchNotes();
      setRefreshing(false);
    }, 2000);
  }, []);
  // Filter notes by search term (title only)
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // const getPathFromUrl = (url: string | null) => {
  //   if (!url) return null;

  //   const path = url.split("/note-images/");
  //   return path.length > 1 ? path[1] : null;
  // };

  // Delete note and its image from storage
  const handleDelete = async (item: Note) => {
    setDeleting(true);

    // const oldPath = getPathFromUrl(item.image_url || null);
    // if (oldPath) {
    //   const { error: deleteError } = await supabase.storage
    //     .from("note-images")
    //     .remove([oldPath]);

    //   if (deleteError) {
    //     console.log("Error deleting image in note list:", deleteError.message);
    //   }
    // }

    const result = await deleteNote(item.id, item.image_url);

    if (!result.success) {
      Toast.show({
        type: "error",
        text1: "Failed to delete note",
        text2: result.error,
      });
      setDeleting(false);

      return;
    }

    // Remove from local state so the list updates instantly
    setNotes((prev) => prev.filter((n) => n.id !== item.id));
    setDeleting(false);
    setDeletingNote(null);

    Toast.show({
      type: "success",
      text1: "Note deleted",
    });
  };

  const handleView = (item: Note) => {
    router.push({
      pathname: "/notes/[note]",
      params: { note: item.id },
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
            style={styles.deleteButton}
            onPress={() => setDeletingNote(item)}
          >
            <Ionicons name="trash-outline" size={22} color="#ec4545" />
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>My Notes</Text>
          <Text style={styles.subtitle}>
            {notes.length} {notes.length === 1 ? "note" : "notes"} total
          </Text>
        </View>
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#ffffff" />
        </Pressable>
      </View>

      {/* Search bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#55557a" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            placeholderTextColor="#55557a"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <Pressable
              onPress={() => setSearchTerm("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color="#55557a" />
            </Pressable>
          )}
        </View>

        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#9b4d75"]} //andriod
              tintColor="#9b4d75"
            />
          }
          contentContainerStyle={[
            styles.listContent,
            filteredNotes.length === 0 && styles.emptyListContent,
          ]}
          ListHeaderComponent={
            searchTerm && filteredNotes.length > 0 ? (
              <View style={styles.countBadge}>
                <Ionicons name="search" size={13} color="#9b4d75" />
                <Text style={styles.countText}>
                  {filteredNotes.length} result
                  {filteredNotes.length !== 1 ? "s" : ""}
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            notes.length === 0 ? (
              <EmptyState
                emptyTitle="No notes yet"
                emptyText="Tap + to create your first note"
              />
            ) : (
              <EmptyState
                emptyTitle="No results"
                emptyText="Try a different search term"
              />
            )
          }
          renderItem={renderItem}
        />
      </KeyboardAvoidingView>

      {/* Floating create button */}
      <Pressable
        style={styles.createButton}
        onPress={() => router.push("/create")}
      >
        <Ionicons name="add" size={26} color="white" />
      </Pressable>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050508",
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050508",
    paddingHorizontal: 20,
  },
  loadingText: {
    color: "#9b4d75",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#9b4d75",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#55557a",
    marginTop: 2,
    fontWeight: "500",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#2a2a44",
    backgroundColor: "#12121e",
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#ffffff",
    height: "100%",
  },
  clearButton: {
    padding: 2,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
    paddingBottom: 4,
  },
  countText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#55557a",
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1a1a2e",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a0a0a",
    borderWidth: 1,
    borderColor: "#2d1111",
  },
  createButton: {
    position: "absolute",
    right: 20,
    bottom: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9b4d75",
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#9b4d75",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#12121e",
    borderWidth: 1,
    borderColor: "#2a2a44",
  },
});
