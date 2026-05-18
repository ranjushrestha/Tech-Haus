import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoteDetail() {
  const { note } = useLocalSearchParams();

  const id = Array.isArray(note) ? note[0] : note;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);


  //fetch data on id change
  useEffect(() => {
    fetchSingleNote();
  }, [id]);


  // get single note from db
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

    setEditTitle(data.title);
    setEditContent(data.content);

    setLoading(false);
  };


  
  const handleEdit = () => {
    setEditTitle(title);
    setEditContent(content);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditContent(content);
    setIsEditing(false);
  };


  //update note
  const handleUpdate = async () => {
      if (!id) return;

      setSaving(true);

      const { error } = await supabase
        .from("notes")
        .update({
          title: editTitle.trim(),
          content: editContent.trim(),
        })
        .eq("id", id);

      if (error) {    
        console.log("Update error:", error.message);
        setSaving(false);
        return;
      }

      setTitle(editTitle.trim());
      setContent(editContent.trim());

      setIsEditing(false);
      setSaving(false);
    };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#9b4d75", fontSize: 22 }}>Loading...</Text>
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
        {isEditing ? (
          <TextInput
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Title"
            style={{
              borderBottomWidth: 2,
              borderColor: "#9b4d75",
              marginBottom: 10,
              paddingBottom: 4,
              fontSize: 20,
              fontWeight: "600",
            }}
          />
        ) : (
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
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12 }}
        >
          {isEditing ? (
            <TextInput
              value={editContent}
              onChangeText={setEditContent}
              placeholder="Content"
              multiline
              textAlignVertical="top"
              style={{
                minHeight: 300,
                fontSize: 16,
              }}
            />
          ) : (
            <Text style={{ fontSize: 16 }}>{content}</Text>
          )}
        </ScrollView>

        {isEditing ? (
          <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
            <Pressable
              onPress={handleUpdate}
              style={{
                flex: 1,
                backgroundColor: "#9b4d75",
                padding: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                {saving ? "Saving..." : "Save"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleCancel}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#9b4d75",
                padding: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "#9b4d75", textAlign: "center" }}>
                Cancel
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={handleEdit}
            style={{
              marginTop: 20,
              backgroundColor: "#9b4d75",
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Edit
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}


