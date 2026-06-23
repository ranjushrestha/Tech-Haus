import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";

type Props = {
  loading: boolean;
  onPress: () => void;
  buttonText: string;
};
const Button = ({ loading, onPress, buttonText }: Props) => {
  return (
    <Pressable
      style={[styles.button, loading && styles.buttonDisabled]}
      disabled={loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.buttonText}>{buttonText}</Text>
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#9b4d75",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
