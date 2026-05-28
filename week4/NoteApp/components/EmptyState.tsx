import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  emptyTitle: string;
  emptyText: string;
  emptyStyle?: StyleProp<ViewStyle>;
};

const EmptyState = ({ emptyTitle, emptyText, emptyStyle }: Props) => {
  return (
    <View style={[styles.emptyBox, emptyStyle]}>
      <View style={styles.iconCircle}>
        <Ionicons name="document-text-outline" size={32} color="#9b4d75" />
      </View>
      <Text style={styles.emptyTitle}>{emptyTitle}</Text>
      <Text style={styles.emptyText}>{emptyText}</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1a1c2e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#9b4d75",
    letterSpacing: -0.3,
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
