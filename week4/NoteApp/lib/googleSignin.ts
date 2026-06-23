import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "./supabase";
import Toast from "react-native-toast-message";

// Call this once at app startup
export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
    scopes: ["profile", "email"],
  });
}

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();

    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;

    // if (!idToken) throw new Error("No ID token from Google");
    if (!idToken) {
      Toast.show({
        type: "error",
        text1: "Error signing in",
        visibilityTime: 1500,
      });
      return;
    }

    // Pass the token to Supabase — it verifies with Google and creates the session
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });

    console.log("GOOGLE DATA:", data);

    console.log("GOOGLE ERROR:", error);

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.log("ERROR OBJECT:", error);
    console.log("ERROR CODE:", error?.code);
    console.log("ERROR MESSAGE:", error?.message);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log("Cancelled");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log("Already in progress");
    } else if (error?.message?.toLowerCase().includes("network")) {
      // console.error("Google sign in error:", error);
      Toast.show({
        type: "error",
        text1: "You're offline! Check your internet connection.",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Something went wrong! Please try again.",
      });
    }
  }
}

//if you dont signOut from google then existing signed in user will silently get signed in without showing pop up for other google account
export async function signOutFunc() {
  try {
    await GoogleSignin.signOut();
  } catch (e) {
    console.log("google session already cleared");
  }

  return await supabase.auth.signOut();
}
