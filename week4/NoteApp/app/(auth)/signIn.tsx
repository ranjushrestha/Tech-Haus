import {
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


const SignIn = () => {
  const initialState = { email: "", password: "" };

  const [formData, setFormData] = useState(initialState);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (value: string, fieldName: string) => {
    setFormData({ ...formData, [fieldName]: value });
  };

const handleSubmit = async () => {
  if (!formData.email.trim() || !formData.password.trim()) {
    console.log("Email and password required");
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email.trim(),
    password: formData.password,
  });

  if (error) {
    console.log("Login error:", error.message);
    return;
  }

  if (data.user) {
    setFormData(initialState);
    router.replace("/");
  
  }
  console.log("login success")
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>

          <View style={styles.form}>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#979595"
              value={formData.email}
              onChangeText={(email) => handleChange(email, "email")}
              style={styles.input}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#979595"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(password) => handleChange(password, "password")}
                style={styles.input}
              />

              <Pressable style={styles.eyeContainer} onPress={() => setShowPassword((prev) => !prev)}>
                <Ionicons
                name={showPassword? 'eye-off' : 'eye'} size={16} color='gray' />
              </Pressable>
            </View>

            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign In</Text>
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
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddaac6",
    
  },

  keyboardView: {
    flex: 1,
    marginHorizontal: 12,
   
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


  form: {
    gap: 16,
    marginVertical:20
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
    fontWeight: "600",
  },
  passwordContainer:{
    position:'relative',
    width:"100%"
  },
  eyeContainer:{
    position:'absolute',
    right:18,
    top: '60%',
    transform:[{translateY: -12}]
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
