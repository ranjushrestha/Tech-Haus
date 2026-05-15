import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
const signUp = () => {
  const initialState = {
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState(initialState);

  const [showPassword, setShowPassword] = useState(false)
  const handleChange = (value:string, fieldName:string) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = async() => {
   const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
})
// console.log("data:",data)
// console.log("error:",error)

    // console.log("signed up", formData)
    setFormData(initialState)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Sign Up</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter email/ mobile"
              value={formData.email}
              onChangeText={(email) => handleChange(email, "email")}
            />
        

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#979595"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(password) => handleChange(password, "password")}
                style={styles.input}
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

                  <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Confirm password"
                placeholderTextColor="#979595"
                secureTextEntry={!showPassword}
                value={formData.confirmPassword}
                onChangeText={(confirmPassword) => handleChange(confirmPassword, "confirmPassword")}
                style={styles.input}
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
            
            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
          </View>

          <View style={styles.signInContainer}>
            <Text style={styles.signIn}>Already have an account?</Text>
            <Pressable onPress={() => router.push('/signIn')}>
              <Text style={[styles.singInText, styles.signIn]}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingHorizontal: 12,
    
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
    marginVertical: 12
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
  signInContainer:{
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
