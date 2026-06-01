import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import Toast from "react-native-toast-message";

const verifyScreen = () => {
  const { emailAdress } = useLocalSearchParams();
  const email = Array.isArray(emailAdress)
    ? emailAdress[0]
    : (emailAdress ?? "");
  const [token, setToken] = useState("");

  const handleVerification = async () => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      console.log("Error in email verification");
      return;
    }

    Toast.show({
      type: "success",
      text1: "Account verified!",
    });

    router.replace("/signIn");
  };

  return (
    <View>
      <Text>Create your account</Text>
      <Text>We've sent you a passcode</Text>
      <Text>Please check your inbox at ${emailAdress}</Text>

      <TextInput
        placeholder="000000"
        value={token}
        onChangeText={setToken}
        keyboardType="number-pad"
        maxLength={6}
        style={{
          borderWidth: 1,
          padding: 10,
          textAlign: "center",
          fontSize: 18,
        }}
      />

      <Pressable onPress={handleVerification}>
        <Text>Verify</Text>
      </Pressable>
      <Pressable onPress={handleVerification}>
        <Text>Resend</Text>
      </Pressable>
    </View>
  );
};

export default verifyScreen;

const styles = StyleSheet.create({});
