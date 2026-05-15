import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoteDetail() {
  const { note } = useLocalSearchParams();

  const id = Array.isArray(note) ? note[0] : note;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSingleNote();
  }, [id]);

  const fetchSingleNote = async () => {
    if (!id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("notes")
      .select("id, title, content")
      .eq("id", id)
      .single();

    if (error) {
      console.log("Error viewing note:", error.message);
      setLoading(false);
      return;
    }

    setTitle(data.title);
    setContent(data.content);
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, padding: "8%" }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: "8%" }}>
      <View
        style={{
          flex: 1,
          borderWidth: 2,
          borderRadius: 20,
          borderColor: "#9b4d75",
          padding: 20,
          marginTop: 12,
        }}
      >
        <Text
          style={{
            borderBottomWidth: 2,
            borderColor: "#9b4d75",
            marginBottom: 10,
            paddingBottom: 4,
            fontSize: 20,
            fontWeight: "600",
          }}
        >
          {title}
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12 }}
        >
          <Text>{content}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}