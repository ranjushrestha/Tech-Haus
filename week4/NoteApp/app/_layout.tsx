import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import "./global.css";

export default function RootLayout() {
  const { authLoading, setAuthLoading, setUserData } = useStore();

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUserData(session?.user ?? null);
      setAuthLoading(false);
    };

    initializeAuth();

    //runs everytime when signin signout or token changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("auth changed user:", session?.user ?? null);

      setUserData(session?.user ?? null);
    });

    //clean up
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
        // className="flex flex-1 justify-center items-center"
      >
        <ActivityIndicator size="large" color="#9b4d75" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f3dbdb" }}>
        <StatusBar style="dark" />

        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
