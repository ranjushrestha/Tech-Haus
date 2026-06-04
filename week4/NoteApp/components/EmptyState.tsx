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
    paddingVertical: 40,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#12121e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2a2a44",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#55557a",
    textAlign: "center",
    lineHeight: 20,
  },
});
