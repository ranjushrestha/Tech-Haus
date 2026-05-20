import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import EmptyState from "../components/EmptyState ";
import { User } from "@supabase/supabase-js";
import NoteBox from "@/components/NoteBox";

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

const [user, setUser] = useState<User | null>(null);

  const fetchNotes = useCallback(async () => {
    if (notes.length === 0) {
      setLoading(true);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    setUser(user)

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
    }, [fetchNotes]),
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

    router.replace("/signIn");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: Note }) => {
    return (
      <Pressable
        onPress={() => handleView(item)}
        style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
      >
        <View style={styles.cardContent}>

          <NoteBox item={item}/>

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
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Notes</Text>
         {user ?   
         <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
        :
        <Pressable style={styles.signOutButton} onPress={() => router.push("/signIn")}>
          <Text style={styles.signOutText}>Sign In</Text>
          </Pressable>}
      
      </View>

      {notes.length > 0 && (
        <Text style={styles.subHeading}>
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#9b4d75",
  },

  subHeading: {
    marginBottom: 4,
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

  noteBox: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  date: {
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
  signOutButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#9b4d75",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  signOutText: {
    color: "white",
    fontWeight: "600",
  },
});
