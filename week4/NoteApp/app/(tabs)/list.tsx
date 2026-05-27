import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import EmptyState from "../../components/EmptyState ";
import NoteBox from "@/components/NoteBox";
import { useStore } from "@/store/useStore";
import { SafeAreaView } from "react-native-safe-area-context";

type Note = {
  id: string;
  title: string;
  content: string;
  user_id?: string;
  created_at?: string;
};

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useStore();

  const fetchNotes = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error.message);
      setLoading(false);
      return;
    }

    setNotes(data ?? []);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, []),
  );

  const handleDelete = async (item: Note) => {
    const { error } = await supabase.from("notes").delete().eq("id", item.id);

    if (error) {
      console.log("Delete error:", error.message);
      return;
    }

    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== item.id));
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
    console.log("user signed out");
    router.replace("/signIn");
  };

  const renderItem = ({ item }: { item: Note }) => {
    return (
      <Pressable onPress={() => handleView(item)} style={styles.card}>
        <View style={styles.cardContent}>
          <NoteBox item={item} />

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              handleDelete(item);
            }}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={24} color="red" />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
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

      {notes.length > 0 && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </Text>
        </View>
      )}

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          notes.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={<EmptyState />}
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
  },

  loadingText: {
    color: "#9b4d75",
    fontSize: 22,
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
    alignItems: "flex-start",
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
    right: 20,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#9b4d75",
    padding: 16,
    borderRadius: 999,
    shadowColor: "#9b4d75",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  createButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
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
