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
      <View style={styles.accentBar} />
      <View style={styles.contentWrap}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title?.trim()
            ? item.title
            : item.content?.trim().split(" ")[0] || "Untitled"}
        </Text>
        <Text numberOfLines={2} style={styles.preview}>
          {item.content?.trim() || "No content"}
        </Text>
        <Text style={styles.date}>
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : ""}
        </Text>
      </View>
    </View>
  );
};

export default NoteBox;

const styles = StyleSheet.create({
  noteBox: {
    flex: 1,
    flexDirection: "row",
  },
  accentBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: "#9b4d75",
    marginRight: 14,
  },
  contentWrap: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.2,
  },
  preview: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#6b7280",
  },
  date: {
    marginTop: 6,
    fontSize: 12,
    color: "#4a5568",
    fontWeight: "500",
  },
});
