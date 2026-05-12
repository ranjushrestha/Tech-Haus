import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ToastAndroid
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function NotesScreen({ navigation, notes, setNotes }) {
  
  const [isEditId, setIsEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  


  function addNote() {
    if (!title.trim() || !content.trim()) return;
   
      const newNote = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
      };

      setNotes((prevNotes) => [newNote, ...prevNotes]);

     
        Toast.show({
          type:'success',
          text1:'Note saved successfully',
          position:'top',
          visibilityTime:1500,
        })
      
    
    setTitle("");
    setContent("");
  }





 
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',marginBottom: 20,}}>
           <Text style={styles.header}> Notes</Text>
           <Pressable
          style={{
            backgroundColor: "blue",
            padding: 8,
            width: "80",
            borderRadius: 20,
          }}
          onPress={() => navigation.push("Login")}
        >
          <Text
            style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
          >
            Sign out
          </Text>
        </Pressable>
        </View>
       

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={addNote}>
          <Text style={styles.buttonText}>
           Save Note
          </Text>
        </TouchableOpacity>

  

     
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  contentInput: {
    height: '60%',
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 30,
  },
  emptyTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  noteCard: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#999",
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  actionContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  actionText: {
    fontWeight: "bold",
    color: "#000",
  },

  deleteText: {
    color: "red",
  },
});
