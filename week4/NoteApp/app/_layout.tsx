import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, AppState, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { configureGoogleSignIn } from "@/lib/googleSignin";
import { Session } from "@supabase/supabase-js";

configureGoogleSignIn();

export default function RootLayout() {
  const { authLoading, setAuthLoading, setUserData } = useStore();

  const verifyAndSetUser = async (session: Session | null) => {
    if (!session?.user) {
      setUserData(null);
      setAuthLoading(false);
      return;
    }
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      setUserData(null);
    } else {
      setUserData(user);
    }
    setAuthLoading(false);
  };

  useEffect(() => {
    // Handle auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === "INITIAL_SESSION") {
        // verify with server on cold start — catches deleted users
        await verifyAndSetUser(session);
      } else if (_event === "SIGNED_IN" || _event === "TOKEN_REFRESHED") {
        // TOKEN_REFRESHED only fires for valid users so no need to verify
        // SIGNED_IN is a fresh login so trust it
        setUserData(session?.user ?? null);
        setAuthLoading(false);
      } else if (_event === "SIGNED_OUT") {
        setUserData(null);
        setAuthLoading(false);
      }
    });

    // Handle app coming to foreground
    // const appStateSubscription = AppState.addEventListener(
    //   "change",
    //   async (state) => {
    //     if (state === "active") {
    //       const {
    //         data: { user },
    //         error,
    //       } = await supabase.auth.getUser();
    //       if (error || !user) {
    //         await supabase.auth.signOut({ scope: "local" });
    //         setUserData(null);
    //       }
    //       // if valid, do nothing — no need to update state
    //     }
    //   },
    // );

    return () => {
      subscription.unsubscribe();
      // appStateSubscription.remove();
    };
  }, []);

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
            contentStyle: {
              backgroundColor: "#050508",
            },
          }}
        />
        <Toast swipeable={true} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
