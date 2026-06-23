import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { signInWithGoogle } from "@/lib/googleSignin";
import Toast from "react-native-toast-message";

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      const data = await signInWithGoogle();
      if (data) {
        router.replace("/list");
      }
    } catch (e) {
      // already logged in googleSignIn.ts
      Toast.show({
        type: "error",
        text1: "Error signing in ",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, loading && { opacity: 0.6 }]}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#9b4d75" />
      ) : (
        <Text style={styles.text}>Sign in with Google</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderWidth: 0.6,
    borderColor: "#9b4d75",
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#9b4d75",
    fontWeight: "600",
    fontSize: 16,
  },
});
