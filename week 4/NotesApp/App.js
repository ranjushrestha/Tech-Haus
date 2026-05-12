import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import NotesScreen from "./screens/NotesScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ViewNoteScreen from "./screens/ViewNoteScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [notes, setNotes] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} notes={notes} setNotes={setNotes}  />} 
        </Stack.Screen>

        <Stack.Screen name="Notes">
          {(props) => (
            <NotesScreen {...props} notes={notes} setNotes={setNotes} />
          )}
        </Stack.Screen>

        <Stack.Screen name="ViewNote" component={ViewNoteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}