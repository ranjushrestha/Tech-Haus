import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { configureGoogleSignIn } from "@/lib/googleSignin";

configureGoogleSignIn();

export default function RootLayout() {
  const { authLoading, setAuthLoading, setUserData } = useStore();

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setUserData(null);
        setAuthLoading(false);
        return;
      }

      setUserData(user);
      setAuthLoading(false);
    };

    initializeAuth();

    // runs every time when signin, signout, or token changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("EVENT:", _event);
      console.log("auth changed user:", session?.user ?? null);

      if (session?.user) {
        setUserData(session.user);
      } else {
        setUserData(null);
      }

      setAuthLoading(false);
    });

    // clean up
    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#a12867" />
      </View>
    );
  }

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
