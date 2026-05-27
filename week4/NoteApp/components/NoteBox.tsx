import { StyleSheet, Text, View } from "react-native";
import React from "react";

type Note = {
  id: string;
  title: string;
  content: string;
  user_id?: string;
  created_at?: string;
};
const NoteBox = ({ item }: { item: Note }) => {
  return (
    <View style={styles.noteBox}>
      <Text numberOfLines={1} style={styles.title}>
        {item.title?.trim()
          ? item.title
          : item.content?.trim().split(" ")[0] || "Untitled"}
      </Text>

      <Text style={styles.date}>{item.created_at?.split("T")[0]}</Text>
    </View>
  );
};

export default NoteBox;

const styles = StyleSheet.create({
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
});
