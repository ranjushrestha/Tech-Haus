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
        // setAuthError("Email not confirmed");
        router.replace({
          pathname: "/verifyScreen",
          params: { emailAddress: data.email }, //token expired or invalid
        });
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
        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="document-text" size={28} color="#9b4d75" />
          </View>
          <Text style={styles.brandName}>NoteApp</Text>
          <Text style={styles.brandTagline}>Your thoughts, organized</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome back</Text>

          {authError ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle"
                size={16}
                color="#ff3b5c"
                style={{ marginRight: 6 }}
              />
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
                <View>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#55557a"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[styles.input, errors.email && styles.inputError]}
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
                required: "Password required",
              }}
              render={({ field: { value, onChange } }) => (
                <View>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <View
                    style={[
                      styles.passwordContainer,
                      errors.password && styles.inputError,
                    ]}
                  >
                    <TextInput
                      placeholder="Enter your password"
                      placeholderTextColor="#55557a"
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={(text) => {
                        setAuthError("");
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
                        color="#8888bb"
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

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Pressable onPress={() => router.push("/signUp")}>
              <Text style={styles.footerLink}>Register Now!</Text>
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
    backgroundColor: "#050508",
  },

  keyboardView: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  brandSection: {
    alignItems: "center",
    marginBottom: 40,
  },

  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#12121e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a44",
  },

  brandName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
    marginBottom: 4,
  },

  brandTagline: {
    fontSize: 14,
    color: "#55557a",
    letterSpacing: 0.2,
  },

  card: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    backgroundColor: "#0a0a12",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "#1a1a2e",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 24,
    letterSpacing: -0.3,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d1122",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4d1a33",
  },

  errorText: {
    color: "#ff3b5c",
    fontSize: 14,
    flex: 1,
  },

  form: {
    gap: 20,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#55557a",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#2a2a44",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#12121e",
    color: "#ffffff",
  },

  inputError: {
    borderColor: "#ff3b5c",
  },

  fieldError: {
    color: "#ff3b5c",
    fontSize: 13,
    marginTop: 6,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a44",
    borderRadius: 14,
    backgroundColor: "#12121e",
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
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
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 28,
  },

  footerText: {
    color: "#55557a",
    fontSize: 14,
  },

  footerLink: {
    color: "#9b4d75",
    fontSize: 14,
    fontWeight: "700",
  },
});
