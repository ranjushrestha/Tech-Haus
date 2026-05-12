import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ViewNoteScreen = ({ route, navigation }) => {
  const { note } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>

        <Text style={styles.screenTitle}>View Note</Text>
      </View>

      <View style={styles.wrapper}> 
        <View style={styles.card}>
          <Text style={styles.title}>{note.title}</Text>

          <Text style={styles.date}>
            Created • {new Date().toLocaleDateString()}
          </Text>

          <View style={styles.divider} />

          <ScrollView
           
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Text style={styles.content}>{note.content}</Text>
          </ScrollView>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default ViewNoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  backButton: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  screenTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },

  wrapper: {
    flex: 1,
    padding: 20,
  },

  card: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#e5e5e5",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },

  date: {
    color: "#777",
    fontSize: 14,
    marginBottom: 18,
  },

  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 20,
  },

  content: {
    fontSize: 18,
    lineHeight: 30,
    color: "#333",
  },




});