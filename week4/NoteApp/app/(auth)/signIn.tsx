import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Controller, useForm } from "react-hook-form";
import { useStore } from "@/store/useStore";

type FormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const setUserData = useStore((state) => state.setUserData);

  const onSubmit = async (data: FormData) => {
    setAuthError("");
    setLoading(true);

    const { error, data: supaBaseUser } =
      await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });

    console.log("DATA:", supaBaseUser);

    if (error) {
      if (error.message.includes("confirmed")) {
        setAuthError("Email not confirmed");
      } else {
        setAuthError("Invalid email or password");
      }

      console.log("Login error:", error.message);
      setLoading(false);
      return;
    }

    if (supaBaseUser.user) {
      setUserData(supaBaseUser.user);
    }

    reset();
    setLoading(false);
    router.replace("/list");

    console.log("login success");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>

          {authError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{authError}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#979595"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              )}
            />

            {errors.email && (
              <Text style={styles.fieldError}>{errors.email.message}</Text>
            )}

            <View style={styles.passwordContainer}>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Password required",
                }}
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#979595"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={(text) => {
                      setAuthError("");
                      onChange(text);
                    }}
                    style={styles.input}
                  />
                )}
              />

              <Pressable
                style={styles.eyeContainer}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={16}
                  color="gray"
                />
              </Pressable>
            </View>

            {errors.password && (
              <Text style={styles.fieldError}>{errors.password.message}</Text>
            )}

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.singUpContainer}>
            <Text style={styles.signUp}>Don't have an account?</Text>

            <Pressable onPress={() => router.push("/signUp")}>
              <Text style={[styles.singUpText, styles.signUp]}>
                Register Now!
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3dbdb",
  },

  keyboardView: {
    flex: 1,
    marginHorizontal: 12,
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: 350,
    padding: 24,
    borderRadius: 14,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },

  errorBox: {
    backgroundColor: "#c45a5a",
    padding: 8,
    borderRadius: 6,
  },

  errorText: {
    color: "white",
    textAlign: "center",
  },

  form: {
    gap: 12,
    marginVertical: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
    color: "#000",
  },

  fieldError: {
    color: "#b00020",
    fontSize: 13,
  },

  button: {
    backgroundColor: "#9b4d75",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  passwordContainer: {
    position: "relative",
    width: "100%",
  },

  eyeContainer: {
    position: "absolute",
    right: 18,
    top: "50%",
    transform: [{ translateY: -8 }],
  },

  singUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },

  singUpText: {
    color: "#9b4d75",
  },

  signUp: {
    fontWeight: "400",
    fontSize: 14,
  },
});
