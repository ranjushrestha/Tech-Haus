import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
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

  useEffect(() => {
    fetchNotes();
  }, [notes]);

  const fetchNotes = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
     
      return;
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    console.log("Fetched notes:", data);

    if (error) {
      console.log("Fetch error:", error.message);
      return;
    }

    setNotes(data ?? []);
  };

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

  return (
    <SafeAreaView style={{ flex: 1, padding: 8 }}>
      {notes.length === 0 ? (
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#9b4d75",
            textAlign: "center",
          }}
        >
          No notes yet!
        </Text>
      ) : (
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#9b4d75",
            marginBottom: 12,
          }}
        >
          My Notes
        </Text>
      )}

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleView(item)}>
            <View
              style={{
                borderRadius: 20,
                borderWidth: 1.4,
                borderColor: "#9b4d75",
                padding: 20,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "600" }}>
                    {item.title?.trim()
                      ? item.title
                      : item.content?.trim().split(" ")[0] || "Untitled"}
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={{ marginTop: 6, color: "#555" }}
                  >
                    {item.content}
                  </Text>
                </View>

                <View style={{ gap: 8, alignItems: "center" }}>
                  <Pressable onPress={() => handleDelete(item)}>
                    <Ionicons name="trash" size={22} color="red" />
                  </Pressable>

                  <Pressable onPress={() => router.push("/create")}>
                    <Ionicons name="create" size={22} color="#9b4d75" />
                  </Pressable>
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />

      <Pressable
        style={{
          width: "30%",
          borderRadius: 20,
          padding: 10,
          alignSelf: "flex-end",
          backgroundColor: "#9b4d75",
        }}
        onPress={() => router.push("/create")}
      >
        <Text
          style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
        >
          Create
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({});
