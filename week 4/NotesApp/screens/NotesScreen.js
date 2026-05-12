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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotesScreen({ navigation, notes, setNotes }) {
  const [refreshing, setRefreshing] = useState(false)
  
  const [isEditId, setIsEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

 const onRefresh = useCallback(() => {
  setRefreshing(true);


  //fetchNotes()
  setTimeout(() => {
    setNotes((prev) =>
      prev.map((note) => ({
        ...note,
        content: note.content + Math.floor(Math.random() * 10),// refresh simulator
      }))
    );

    setRefreshing(false);
  }, 1000);
}, []);

  function addNote() {
    if (!title.trim() || !content.trim()) return;
   // if id is provided edit existing note with given id 
    if (isEditId) {
      setNotes((prev) =>
        prev.map((item) =>
          item.id === isEditId
            ? { ...item, title: title.trim(), content: content.trim() }
            : item,
        ),
      );
      setIsEditId(null);
    } else {// if id is not given create new note with id , title, content
      const newNote = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
      };

      setNotes((prevNotes) => [newNote, ...prevNotes]);
    }

    

    setTitle("");
    setContent("");
  }
// set Id for isEditId from item with title and content
  const handleEdit = (item) => {
    setIsEditId(item.id);
    setTitle(item.title);
    setContent(item.content);
  };



 
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
            {isEditId ? "Update Note" : "Save Note"}
          </Text>
        </TouchableOpacity>

        {/* {notes.length === 0 && (
          <View style={styles.emptyTextContainer}>
            <Text>No notes yet!</Text>
          </View>
        )} */}

        {/* <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={notes}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag" //dismiss keyboard when scrolling
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text numberOfLines={2}>{item.content}</Text>

              <View style={styles.actionContainer}>
                <Pressable onPress={() => handleEdit(item)}>
                  <Text style={styles.actionText}>Edit</Text>
                </Pressable>

              
              </View>
            </View>
          )}
        /> */}

     
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
