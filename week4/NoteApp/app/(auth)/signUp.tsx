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

  // const user = useStore((state) => state.user);

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

      Toast.show({
        type: "success",
        text1: "User created successfully",
        position: "top",
        visibilityTime: 2000,
      });

      // if email not confirmed show different toast

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
        <View style={styles.card}>
          <Text style={styles.title}>Sign Up</Text>
          {signUpError && (
            <Text style={{ color: "#cb5a5a" }}>{signUpError}</Text>
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
                <TextInput
                  style={styles.input}
                  placeholder="Enter email"
                  value={value}
                  onChangeText={(text) => {
                    setSignUpError("");
                    onChange(text);
                  }}
                  keyboardType="email-address"
                />
              )}
            />

            {errors.email && <Text>{errors.email.message}</Text>}

            <View style={styles.passwordContainer}>
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
                  <TextInput
                    placeholder="Enter password"
                    placeholderTextColor="#979595"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={(text) => {
                      setSignUpError("");
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
                  size={18}
                  color="gray"
                />
              </Pressable>
              {errors.password && <Text>{errors.password.message}</Text>}
            </View>

            <View style={styles.passwordContainer}>
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === watch("password") || "Password do no match",
                }}
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    placeholder="Confirm password"
                    placeholderTextColor="#979595"
                    secureTextEntry={!showConfirmPassword}
                    value={value}
                    onChangeText={(text) => {
                      setSignUpError("");
                      onChange(text);
                    }}
                    style={styles.input}
                  />
                )}
              />
              <Pressable
                style={styles.eyeContainer}
                onPress={() => setShowConfirmPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={18}
                  color="gray"
                />
              </Pressable>

              {errors.confirmPassword && (
                <Text>{errors.confirmPassword.message}</Text>
              )}
            </View>

            <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.signInContainer}>
            <Text style={styles.signIn}>Already have an account?</Text>
            <Pressable onPress={() => router.dismissTo("/signIn")}>
              <Text style={[styles.singInText, styles.signIn]}>Sign In</Text>
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
    backgroundColor: "#ddaac6",
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
    borderRadius: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },

  form: {
    gap: 16,
    marginVertical: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },

  button: {
    backgroundColor: "#9b4d75",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeContainer: {
    position: "absolute",
    right: 18,
    top: "60%",
    transform: [{ translateY: -12 }],
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  singInText: {
    color: "#9b4d75",
  },
  signIn: {
    fontWeight: "400",
    fontSize: 14,
  },
});
