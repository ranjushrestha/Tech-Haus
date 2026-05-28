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
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const signUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signUpError, setSignUpError] = useState("");

  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      setSignUpError("");

      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log("SIGNUP DATA:", data);
      console.log("SIGNUP ERROR:", error);

      if (error) {
        setSignUpError(error.message);

        return;
      }

      if (!data.user) {
        setSignUpError("Signup failed. Please try again.");
        return;
      }

      if (data.user.identities?.length === 0) {
        setSignUpError("User already exists. Please sign in.");
        return;
      }

      if (!data.user.confirmed_at) {
        setSignUpError("Already registered. Confirm your email");
        return;
      }

      Toast.show({
        type: "success",
        text1: "User created successfully",
        position: "top",
        visibilityTime: 2000,
      });

      reset();
    } catch (err) {
      console.log("CATCH ERROR:", err);
      setSignUpError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="document-text" size={28} color="#9b4d75" />
          </View>
          <Text style={styles.brandName}>NoteApp</Text>
          <Text style={styles.brandTagline}>Create your account</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Get started</Text>

          {signUpError && (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle"
                size={16}
                color="#ff5252"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.errorText}>{signUpError}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <View>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Enter email"
                    placeholderTextColor="#4a5568"
                    value={value}
                    onChangeText={(text) => {
                      setSignUpError("");
                      onChange(text);
                    }}
                    keyboardType="email-address"
                  />
                  {errors.email && (
                    <Text style={styles.fieldError}>
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <View>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <View
                    style={[
                      styles.passwordContainer,
                      errors.password && styles.inputError,
                    ]}
                  >
                    <TextInput
                      placeholder="Enter password"
                      placeholderTextColor="#4a5568"
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={(text) => {
                        setSignUpError("");
                        onChange(text);
                      }}
                      style={styles.passwordInput}
                    />

                    <Pressable
                      style={styles.eyeContainer}
                      onPress={() => setShowPassword((prev) => !prev)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={18}
                        color="#6b7280"
                      />
                    </Pressable>
                  </View>
                  {errors.password && (
                    <Text style={styles.fieldError}>
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Confirm password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              }}
              render={({ field: { value, onChange } }) => (
                <View>
                  <Text style={styles.fieldLabel}>Confirm Password</Text>
                  <View
                    style={[
                      styles.passwordContainer,
                      errors.confirmPassword && styles.inputError,
                    ]}
                  >
                    <TextInput
                      placeholder="Confirm password"
                      placeholderTextColor="#4a5568"
                      secureTextEntry={!showConfirmPassword}
                      value={value}
                      onChangeText={(text) => {
                        setSignUpError("");
                        onChange(text);
                      }}
                      style={styles.passwordInput}
                    />
                    <Pressable
                      style={styles.eyeContainer}
                      onPress={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={18}
                        color="#6b7280"
                      />
                    </Pressable>
                  </View>
                  {errors.confirmPassword && (
                    <Text style={styles.fieldError}>
                      {errors.confirmPassword.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable onPress={() => router.dismissTo("/signIn")}>
              <Text style={styles.footerLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default signUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f111a",
  },

  keyboardView: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  brandSection: {
    alignItems: "center",
    marginBottom: 24,
  },

  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1a1c2e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  brandName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },

  brandTagline: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },

  card: {
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 20,
    letterSpacing: -0.3,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3d1a1a",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },

  errorText: {
    color: "#ff5252",
    fontSize: 14,
    flex: 1,
  },

  form: {
    gap: 16,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#252840",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#1a1c2e",
    color: "#ffffff",
  },

  inputError: {
    borderColor: "#ff5252",
  },

  fieldError: {
    color: "#ff5252",
    fontSize: 13,
    marginTop: 4,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#252840",
    borderRadius: 12,
    backgroundColor: "#1a1c2e",
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#ffffff",
  },

  eyeContainer: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  button: {
    backgroundColor: "#9b4d75",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 24,
  },

  footerText: {
    color: "#6b7280",
    fontSize: 14,
  },

  footerLink: {
    color: "#9b4d75",
    fontSize: 14,
    fontWeight: "600",
  },
});
