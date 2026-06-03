import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import Toast from "react-native-toast-message";
import OTPTextInput from "react-native-otp-textinput";
import { Ionicons } from "@expo/vector-icons";

const VerifyScreen = () => {
  const { emailAddress, type } = useLocalSearchParams();

  const email = Array.isArray(emailAddress)
    ? emailAddress[0]
    : (emailAddress ?? "");

  const verificationType = Array.isArray(type) ? type[0] : type || "signup";

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let otpRef = useRef<any>(null);

  //clear field when error or while resending code
  const handleClear = () => {
    if (otpRef.current) {
      otpRef.current.clear();
    }
  };

  const handleVerification = async () => {
    if (token.trim().length !== 6) {
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
      type: verificationType as any,
    });
    setLoading(false);

    if (error) {
      console.log("Error in email verification:", error.message);
      // Toast.show({
      //   type: "error",
      //   text1: error.message || "Verification failed. Please try again.",
      // });
      setError(error.message || "Verification failed. Please try again.");
      handleClear();
      return;
    }

    Toast.show({
      type: "success",
      text1: "email verified",
    });

    router.replace("/signIn");
  };

  const handleResend = async () => {
    handleClear();
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: verificationType as any,
      email,
    });
    setLoading(false);

    if (error) {
      console.log("Error resending code:", error.message);
      // Toast.show({
      //   type: "error",
      //   text1: error.message || "Failed to resend. Please try again.",
      // });
      setError(error.message || "Failed to resend. Please try again.");
      return;
    }

    Toast.show({
      type: "success",
      text1: "Passcode resent. Please check your email.",
    });
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#12121e",
          borderWidth: 1,
          borderColor: "#1a1a2e",
        }}
        onPress={() => router.replace("/(auth)/signIn")}
      >
        <Ionicons name="chevron-back" size={22} color="#ffffff" />
      </Pressable>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          padding: 24,
          justifyContent: "center",
        }}
      >
        <Text style={styles.heading}>Create your account</Text>
        <Text style={styles.subheading}>We've sent you a passcode</Text>
        <Text style={styles.description}>
          Please check your inbox at {email}
        </Text>

        <OTPTextInput
          ref={otpRef}
          inputCount={6}
          tintColor="#7c3aed"
          offTintColor="#334155"
          handleTextChange={(otpCode) => {
            console.log("otpCode:", otpCode);
            setToken(otpCode);
          }}
          textInputStyle={
            {
              borderBottomWidth: 1,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "#334155",
              backgroundColor: "#0f172a",
              color: "#fff",
              height: 56,
              width: "14%",
              fontSize: 22,
              fontWeight: "600",
            } as any
          }
          textContentType="oneTimeCode"
          containerStyle={{ width: "100%", marginBottom: 20 }}
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

        {error && (
          <Text style={{ color: "#fe6161", textAlign: "center" }}>{error}</Text>
        )}
        <Pressable
          onPress={handleResend}
          disabled={loading}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Resend code</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: "2%",
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
    marginTop: 12,
  },
  linkText: {
    color: "#7c3aed",
    fontWeight: "600",
  },
});
