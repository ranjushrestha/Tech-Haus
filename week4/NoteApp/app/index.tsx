import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNoteStore } from "@/store/useNoteStore";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";

type Note = {
  id: string;
  title: string;
  content: string;
};

const index = () => {
  const notes = useNoteStore((state) => state.notes);
  const { deleteNote, setNotes } = useNoteStore();
 

  useEffect(() => {
   fetchNotes()
  }, [])
  
  const fetchNotes = async () => {
    const {data: {user}} = await supabase.auth.getUser()
    if (!user) return
    

    const {data, error} = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {ascending: false})

    if(error) {
      console.log('Fetch error:', error.message)
      return
    }
    setNotes(data  || [])
  }


  const handleDelete = async (item: Note) => {
    const { error } = await supabase.from("notes").delete().eq("id", item.id);

    if (error) {
      console.log("Delete error", error.message);
    }
    deleteNote(item.id);
  };

  const handleView = (item: Note) => {
    router.push({
      pathname: "/notes/[note]",
      params: {
        note: item.id,
        title: item.title,
        content: item.content
      },
    });
  };
  return (
    <SafeAreaView style={{ flex: 1, padding: 8, gap: 12 }}>
      {notes.length === 0 && (
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
      )}
      {notes.length !== 0 && (
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#9b4d75" }}>
          My Notes
        </Text>
      )}

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              borderRadius: 20,
              borderWidth: 1.4,
              borderColor: "#9b4d75",
              padding: 20,
              marginBottom: 12,
            }}
          >
            <Pressable onPress={() => handleView(item)} style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>
                  {item.title?.trim()
                    ? item.title
                    : item.content?.trim().split(" ")[0] || "Untitled"}
                </Text>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDelete(item);
                  }}
                >
                  <Text style={{ color: "red" }}>Delete</Text>
                </Pressable>
              </View>
            </Pressable>
          </View>
        )}
      />

      <Pressable
        style={{
          width: "20%",
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

export default index;

const styles = StyleSheet.create({});
