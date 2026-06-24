import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { AppState, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { configureGoogleSignIn } from "@/lib/googleSignin";
import { Session } from "@supabase/supabase-js";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync().catch(() => {});

configureGoogleSignIn();

export default function RootLayout() {
  const { authLoading, setAuthLoading, setUserData } = useStore();

  console.log("[RootLayout] render, authLoading =", authLoading);

  const verifyAndSetUser = async (session: Session | null) => {
    console.log("[verifyAndSetUser] called, session =", !!session);
    if (!session?.user) {
      console.log("[verifyAndSetUser] no session -> setUserData(null)");
      setUserData(null);
      setAuthLoading(false);
      return;
    }
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      console.log(
        "[verifyAndSetUser] getUser error -> signOut + setUserData(null)",
        error,
      );
      await supabase.auth.signOut();
      setUserData(null);
    } else {
      console.log(
        "[verifyAndSetUser] valid user -> setUserData(user)",
        user.id,
      );
      setUserData(user);
    }
    setAuthLoading(false);
  };

  useEffect(() => {
    console.log("[useEffect] subscribing to onAuthStateChange");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log(
        "[onAuthStateChange] event =",
        _event,
        "session =",
        !!session,
      );

      if (_event === "INITIAL_SESSION") {
        await verifyAndSetUser(session);
      } else if (_event === "SIGNED_IN" || _event === "TOKEN_REFRESHED") {
        console.log(
          "[onAuthStateChange] SIGNED_IN/TOKEN_REFRESHED -> setUserData + authLoading=false",
        );
        console.log("SESSION:", session?.user ?? null);

        setUserData(session?.user ?? null);
        setAuthLoading(false);
      } else if (_event === "SIGNED_OUT") {
        console.log(
          "[onAuthStateChange] SIGNED_OUT -> setUserData(null) + authLoading=false",
        );
        setUserData(null);
        setAuthLoading(false);
      }
    });

    const appStateSubscription = AppState.addEventListener(
      "change",
      async (state) => {
        console.log("[AppState] change ->", state);
        if (state === "active") {
          const session = await supabase.auth.getSession();
          console.log(
            "[AppState active] has session =",
            !!session.data.session,
          );
          if (session.data.session) {
            const {
              data: { user },
              error,
            } = await supabase.auth.getUser();
            if (error || !user) {
              console.log("[AppState active] getUser error -> signOut", error);
              await supabase.auth.signOut();
              setUserData(null);
            }
          }
        }
      },
    );

    return () => {
      console.log("[useEffect] cleanup - unsubscribing");
      subscription.unsubscribe();
      appStateSubscription.remove();
      // unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("[splash effect] authLoading =", authLoading);
    if (!authLoading) {
      console.log("[splash effect] hiding splash screen");
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [authLoading]);

  if (authLoading) {
    console.log("[RootLayout] authLoading true -> returning null");
    return null;
  }

  console.log("[RootLayout] rendering Stack");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#050508" }}>
        <StatusBar style="light" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#050508" },
          }}
        />
        <Toast swipeable={true} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
