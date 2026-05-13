import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoteDetail() {
  const {id, title, content } = useLocalSearchParams();
console.log(id)
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1, borderWidth: 2, borderRadius: 20, padding: 20 }}>
        <Text
          style={{ borderBottomWidth: 2, marginBottom: 10, paddingBottom: 4 }}
        >
          {title}
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12 }}
        >
          <Text>{content}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
