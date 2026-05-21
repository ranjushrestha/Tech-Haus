import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const { user, setUserData } = useStore();

  async function fetchUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log("Error fetching user:", error.message);
      return;
    }
    setUserData(data.user);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  console.log("Current user:", user);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ddaac6" }}>
        <StatusBar style="light" />

        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
