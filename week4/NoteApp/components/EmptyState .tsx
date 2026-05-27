import { StyleSheet, Text, View } from "react-native";
import React from "react";

const EmptyState = () => {
  return (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyTitle}>No notes yet!</Text>
      <Text style={styles.emptyText}>Create your first note.</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: "700",
    color: "#9b4d75",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 15,
    color: "#777",
  },
});
