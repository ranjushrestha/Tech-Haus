import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const user = useStore((state) => state.user);
  const setUserData = useStore((state) => state.setUserData);
  const setAuthLoading = useStore((state) => state.setAuthLoading);

  console.log("Current user:", user);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    setAuthLoading(true);
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log("Session error:", error.message);
      setAuthLoading(false);
      return;
    }

    if (data.session?.user) {
      setUserData(data.session.user);
    }

    console.log("session:", data.session?.user);

    setAuthLoading(false);
  }
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
