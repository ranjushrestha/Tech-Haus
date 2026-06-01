import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import Toast from "react-native-toast-message";

const VerifyScreen = () => {
  const { emailAddress } = useLocalSearchParams();
  //params can be a string or array of strings
  const email = Array.isArray(emailAddress)
    ? emailAddress[0]
    : (emailAddress ?? "");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!token.trim()) {
      Toast.show({
        type: "error",
        text1: "Enter the 6-digit passcode",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });
    setLoading(false);

    if (error) {
      console.log("Error in email verification:", error.message);
      Toast.show({
        type: "error",
        text1: error.message || "Verification failed. Please try again.",
      });
      return;
    }

    Toast.show({
      type: "success",
    });

    router.replace("/signIn");
  };

  const handleResend = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    setLoading(false);

    if (error) {
      console.log("Error resending code:", error.message);
      Toast.show({
        type: "error",
        text1: error.message || "Failed to resend. Please try again.",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Passcode resent. Please check your email.",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create your account</Text>
      <Text style={styles.subheading}>We've sent you a passcode</Text>
      <Text style={styles.description}>Please check your inbox at {email}</Text>

      <TextInput
        placeholder="000000"
        placeholderTextColor="#999"
        value={token}
        onChangeText={setToken}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
        textAlign="center"
        editable={!loading}
      />

      <Pressable
        onPress={handleVerification}
        disabled={loading}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          loading && styles.buttonDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </Pressable>

      <Pressable
        onPress={handleResend}
        disabled={loading}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Resend code</Text>
      </Pressable>
    </View>
  );
};

export default VerifyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#0f172a",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subheading: {
    color: "#cbd5e1",
    marginBottom: 4,
  },
  description: {
    color: "#94a3b8",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    color: "#fff",
    padding: 14,
    marginBottom: 16,
    fontSize: 18,
    backgroundColor: "#0f172a",
  },
  button: {
    backgroundColor: "#7c3aed",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  linkButton: {
    alignItems: "center",
  },
  linkText: {
    color: "#7c3aed",
    fontWeight: "600",
  },
});
