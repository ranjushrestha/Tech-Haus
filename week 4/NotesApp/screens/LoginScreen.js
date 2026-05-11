import React, { useState } from "react";
import useForm from "../hooks/useForm";
import {
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginValidation } from "../validations/loginValidation";
import { Ionicons } from "@expo/vector-icons";

export default function App({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);

  const onPress = (formData) => {
    console.log("Login form submitted", formData);
    navigation.navigate("Home");
  };

  const { formData, errors, handleChange, handleSubmit } = useForm(
    { email: "", password: "" },
    loginValidation,
    onPress,
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sigInText}>Sign In</Text>
      <Text style={{color:'red'}}> Voice Note</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={formData.email}
          onChangeText={(email) => handleChange(email, "email")}
        />

        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
             <View style={styles.passwordContainer}>

          <TextInput
            placeholder="Enter password"
            value={formData.password}
            onChangeText={(password) => handleChange(password, "password")}
            style={styles.input}
            secureTextEntry={!showPassword}
          />
          <Pressable  style={styles.iconContainer} onPress={() => setShowPassword((prev) => !prev)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color="gray"/>
          </Pressable>
        </View>

        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        <Pressable onPress={handleSubmit} style={styles.btnContainer}>
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
      </View>

      <View style={styles.singUpContainer}>
        <Text style={styles.signUp}>Don't have an account?</Text>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={[styles.singUpText, styles.signUp]}>Register Now!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#acdfe8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  form: {
    width: "100%",
    maxWidth: 350,
    marginBottom: 18,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
  },

  btnContainer: {
    backgroundColor: "#66c3c6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },

  sigInText: {
    textAlign: "center",
    fontSize: 32,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#0e9ca1",
  },

  singUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },

  singUpText: {
    color: "#0e9ca1",
  },

  signUp: {
    fontWeight: "400",
    fontSize: 14,
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
    passwordContainer: {
    position: "relative",
    width: "100%",
  },
    iconContainer: {
    position: "absolute",
    right: 18,
    top: "60%",
    transform: [{ translateY: -18 }],
  },
});
