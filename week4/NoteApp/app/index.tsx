import { useStore } from "@/store/useStore";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

const Index = () => {
  const user = useStore((state) => state.user);
  const authLoading = useStore((state) => state.authLoading);

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ddaac6",
        }}
      >
        <ActivityIndicator size="large" color="#9b4d75" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/list" />;
  }

  return <Redirect href="/signIn" />;
};

export default Index;
