import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation, notes, setNotes }) {
  const handleView = (item) => { 
    navigation.push("ViewNote", {
      note: item,
      setNotes,
    });
  };

  const handleDelete = (item) => {
    setNotes((prev) => prev.filter((note) => note.id !== item.id));
  };

  return (
    <SafeAreaView style={styles.container}>

      {notes.length === 0 && (
        <View>
          <Text style={styles.header}>No notes yet!</Text>
          <Text>Tap the button below to create your first note</Text>
        </View>
      )}

      {notes.length !== 0 && (
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>My Notes</Text>
        </View>
      )}

      <FlatList
        contentContainerStyle={styles.listContent}
        data={notes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.noteWrapper}>
            <Pressable 
              style={{ flex: 1 }}
              onPress={() => handleView(item)}
            >
              <View style={styles.noteCard}>
                
                <Text style={styles.noteTitle}>
                 
                  {item.title?.trim()
                    ? item.title
                    : item.content?.trim().split(" ")[0] || "Untitled"}
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.push("Notes")}
      >
        <Text style={styles.buttonText}>Create Notes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },

  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  titleWrapper: {
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
  },

  listContent: {
    paddingBottom: 30,
  },

  noteWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },

  noteCard: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#999",
    width: "100%",
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  deleteButton: {
    position: "absolute",
    right: 15,
  },

  deleteText: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: "50%",
    alignSelf: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});