import { Drawer } from "expo-router/drawer";
import Toast from "react-native-toast-message"

export default function RootLayout() {
  return (
   <>
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          title: "My Notes",
        }}
      />

      <Drawer.Screen
        name="create"
        options={{
          title: "Create Note",
        }}
      />

      <Drawer.Screen
        name="notes/[note]"
        options={{
          title: "Note Detail",
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="(auth)/signIn"
        options={{
          title: "Sign In",
          
        }}
      />

      <Drawer.Screen
        name="(auth)/signUp"
        options={{
          title: "Sign Up",
       
        }}
      />
    </Drawer>
       <Toast />
    </>
  );
}