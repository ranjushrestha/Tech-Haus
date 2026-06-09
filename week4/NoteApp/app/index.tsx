import { useStore } from "@/store/useStore";
import { Redirect } from "expo-router";

const Index = () => {
  const user = useStore((state) => state.user);
  const authLoading = useStore((state) => state.authLoading);

  if (authLoading) return null;

  if (user) {
    return <Redirect href="/list" />;
  }

  return <Redirect href="/signIn" />;
};

export default Index;
