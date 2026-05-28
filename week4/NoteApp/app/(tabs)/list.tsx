import {
  ActivityIndicator,
  FlatList,
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
            style={{
              backgroundColor: "#f5b0b0",
              padding: 6,
              borderRadius: "50%",
            }}
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
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.heading}>My Notes</Text>
        </View>

        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 8,
          borderWidth: 1,
          borderRadius: 20,
          marginBottom: 8,
        }}
      >
        <Ionicons name="search" size={18} />
        <TextInput
          style={{ flex: 1 }}
          placeholder="Search notes"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Pressable onPress={() => setSearchTerm("")}>
          <Ionicons name="close" size={18} />
        </Pressable>
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

      <Pressable
        style={styles.createButton}
        onPress={() => router.push("/create")}
      >
        <Ionicons name="add" size={22} color="white" />
      </Pressable>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3dbdb",
    paddingHorizontal: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3dbdb",
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
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
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
    marginBottom: 2,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  heading: {
    fontSize: 32,
    fontWeight: "700",
    color: "#9b4d75",
    letterSpacing: -0.3,
  },

  countBadge: {
    marginBottom: 12,
    backgroundColor: "#efbcbf",
    paddingVertical: 3,
    paddingHorizontal: 6,
    alignSelf: "flex-start",
    borderRadius: 999,
  },

  countText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9b4d75",
    textAlign: "center",
  },

  listContent: {
    paddingBottom: 100,
  },

  emptyListContent: {
    flex: 1,
    justifyContent: "center",
  },

  card: {
    borderRadius: 20,
    backgroundColor: "#fef1f1",
    padding: 16,
    marginBottom: 12,
    borderTopWidth: 0.4,
    borderRightWidth: 0.4,
    borderColor: "#9b6882",
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },

  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fdf0f0",
  },

  createButton: {
    position: "absolute",
    right: "46%",
    bottom: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9b4d75",
    padding: 16,
    borderRadius: 999,
    shadowColor: "#9b4d75",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },

  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#9b4d75",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },

  signOutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
