import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quick Notes</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Notes")}
      >
        <Text style={styles.buttonText}>Go To Notes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});