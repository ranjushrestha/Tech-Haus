import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";

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

  const fetchNotes = useCallback(async () => {
    if (notes.length === 0) {
      setLoading(true);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Fetch error:", error.message);
      setLoading(false);
      return;
    }

    setNotes(data ?? []);
    setLoading(false);
  }, [notes.length]);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  const handleDelete = async (item: Note) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", item.id);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
   <View style={styles.header}>
  <Text style={styles.heading}>My Notes</Text>

  {notes.length > 0 && (
    <Text style={styles.subHeading}>
      {notes.length} {notes.length === 1 ? "note" : "notes"}
    </Text>
  )}
</View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          notes.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No notes yet!</Text>
            <Text style={styles.emptyText}>Create your first note.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleView(item)}
            style={({ pressed }) => [
              styles.card,
              pressed && { opacity: 0.75 },
            ]}
          >
            <View style={styles.cardContent}>
              <View style={styles.textBox}>
                <Text numberOfLines={1} style={styles.title}>
                  {item.title?.trim()
                    ? item.title
                    : item.content?.trim().split(" ")[0] || "Untitled"}
                </Text>

                <Text numberOfLines={2} style={styles.content}>
                  {item.content || "No content"}
                </Text>
              </View>

              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={22} color="red" />
              </Pressable>
            </View>
          </Pressable>
        )}
      />

      <Pressable
        style={styles.createButton}
        onPress={() => router.push("/create")}
      >
        <Ionicons name="add" size={22} color="white" />
      </Pressable>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#9b4d75",
    fontSize: 22,
    fontWeight: "600",
  },

  header: {
    marginBottom: 16,
  },

  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#9b4d75",
  },

  subHeading: {
    marginTop: 4,
    fontSize: 14,
    color: "#843d54",
  },

  listContent: {
    paddingBottom: 100,
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: "700",
    color: "#9b4d75",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 15,
    color: "#777",
  },

  card: {
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "#e6c7d7",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  textBox: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  content: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },

  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff1f1",
  },

  createButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#9b4d75",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 999,
  },

  createButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});