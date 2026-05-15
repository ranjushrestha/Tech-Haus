import { supabase } from "@/lib/supabase";
import { useNoteStore } from "@/store/useNoteStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";



export default function NoteDetail() {
 // rename note to id
  const { note } = useLocalSearchParams();

  const id = Array.isArray(note) ? note[0] : note


  // find note of matched id from store because param do not update after changing state its read only
const updatedNote = useNoteStore((state) =>
  state.notes.find((item) => item.id === id)
);

   
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  
  const { updateNote } = useNoteStore();

  useEffect(() => {
   fetchSingleNote()
  }, [id])

  const fetchSingleNote = async() => {
 if (!id) return

 const {data, error} = await supabase
 .from("notes")
 .select()
 .eq('id', id)
 .single()

 if(error) {
  console.log('error Viewing:', error.message)
 }

 if(data) {

 }
 console.log(data)
  }
  
  

  const handleEdit = () => {
    if(!updatedNote) return
  
    setEditTitle(updatedNote.title)
    setEditContent(updatedNote.content)
    setIsEditing(true)
    
  }

  const handleSave = () => {
    if (!id) return
    updateNote(id, editTitle, editContent);
    setIsEditing(false);
  };

  

  return (
    <SafeAreaView  style={{ flex: 1, padding: "8%" }}>
      <View>
        <Pressable style={{backgroundColor:'#9b4d75', width:60, alignSelf:'flex-end', padding: 6, borderRadius: 20}} onPress={isEditing ? handleSave : handleEdit}>
          <Text style={{textAlign:'center'}}>{isEditing ? "Save" : "Edit"}</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, borderWidth: 2, borderRadius: 20,borderColor:'#9b4d75', padding: 20, marginTop: 12 }}>
        {isEditing ? (
          <TextInput
            value={editTitle}
            onChangeText={setEditTitle}
            style={{ borderBottomWidth: 2, marginBottom: 10, paddingBottom: 4 }}
          />
        ) : (
          <Text style={{ borderBottomWidth: 2,borderColor:'#9b4d75', marginBottom: 10, paddingBottom: 4 }}>
            {updatedNote?.title}
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
              multiline
              textAlignVertical="top"
            />
          ) : (
            <Text>content</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}