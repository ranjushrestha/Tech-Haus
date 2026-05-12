import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import useForm from "../hooks/useForm";
import { signupValidation } from "../validations/signUpValidation";

const SignUpScreen = ({ navigation }) => {
  const onPress = (formData) => {
    console.log("sign up form submitted", formData);
    return "";
  };
// Custom hook
  const { formData, errors, handleChange, handleSubmit } = useForm(
    //initial value
    {
      email: "",
      password: "",
      confirmPassword: "",
    },
    //validation
    signupValidation,
    onPress,
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sigInText}>Sign Up</Text>
 
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        value={formData.email}
        onChangeText={(email) => handleChange(email, "email")}
      />

      {errors.email && (
        <Text style={styles.errorText}>{errors.email}</Text>
      )}

      <TextInput
        placeholder="Enter password"
        value={formData.password}
        onChangeText={(password) => handleChange(password, "password")}
        style={styles.input}
        secureTextEntry
      />

      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <TextInput
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChangeText={(confirmPassword) =>
        handleChange(confirmPassword, "confirmPassword")
        }
        style={styles.input}
        secureTextEntry
      />
           // if password and confirm password doesnt match show error from signupValidation 
      {errors.confirmPassword && (
        <Text style={styles.errorText}>
          {errors.confirmPassword}
        </Text>
      )}

      <Pressable
        onPress={handleSubmit}
        style={styles.btnContainer}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

     // navigate to Login page
      <Text style={styles.signUpText}>
        Already have an account?{" "}
        <Text
          style={styles.signInLink}
          onPress={() => navigation.push("Login")}
        >
          Sign In
        </Text>
      </Text>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#acdfe8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  input: {
    width: "100%",
    maxWidth: 350,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: "white",
  },

  btnContainer: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#66c3c6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },

  sigInText: {
    fontSize: 32,
    marginBottom: 24,
    fontWeight: "bold",
    color: "#0e9ca1",
  },

  signUpText: {
    marginTop: 20,
    fontSize: 15,
  },

  signInLink: {
    color: "#0e9ca1",
    fontWeight: "bold",
  },

  errorText: {
    width: "100%",
    maxWidth: 350,
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
});