import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@/store/useStore";
import * as ImagePicker from "expo-image-picker";

const Notes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);

  const [image, setImage] = useState<string | null>();

  const user = useStore((state) => state.user);

  //   const uploadImage = async (userId: string, imageUri: string) => {
  //convert uri to string
  //     const response = await fetch(imageUri)
  // const blob = await response.blob()

  // const filePath = `${userId}-${Date.now()}.jpg
  // const {data, error} = await supabase.storage
  //.from("note-images")
  //.upload(filePath, blob, {
  //contentType: "image/jpeg",
  //})

  // if (error) {
  //   console.error("Upload error:", error.message);
  //   return null;
  // }

  // // Get public URL
  // const {
  //   data: { publicUrl },
  // } = supabase.storage.from("note-images").getPublicUrl(data.path);

  // return publicUrl;

  //   };

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    if (!user) return null;

    setSaving(true);

    //try(
    // let imageUrl = null
    //if(img){
    //imageUrl = await uploadImage(user.id, image)
    //}

    // )catch(err){
    //console.log(err.message)
    //setLoading(false)}

    //note
    const { data, error } = await supabase
      .from("notes")
      .insert({
        title: title.trim(),
        content: content.trim(),
        user_id: user.id,
      })
      .select()
      .single();

    console.log(data);

    setSaving(false);

    if (error) {
      console.log("Insert error:", error.message);
      return;
    }

    setTitle("");
    setContent("");

    Toast.show({
      type: "success",
      text1: "Note saved successfully",
      position: "top",
      visibilityTime: 1000,
    });

    router.dismissTo("/list");
  };

  async function requestPermissions() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  }

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    console.log("Image result", result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Pressable
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#edcece",
          }}
          onPress={() => goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#9b4d75" />
        </Pressable>
        <Text style={styles.heading}>Create Note</Text>
        <Pressable style={styles.checkButton} onPress={handleAdd}>
          {saving ? (
            <ActivityIndicator size="small" color="#9b4d75" />
          ) : (
            <Ionicons name="checkmark-circle" size={22} color="#9b4d75" />
          )}
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View style={styles.card}>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
              <Pressable style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={22} color="#9b4d75" />
                    <Text style={styles.imageText}>Add an image</Text>
                  </View>
                )}
              </Pressable>
            </View>

            <TextInput
              placeholder="write a note..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              style={styles.contentInput}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Notes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3dbdb",
    paddingHorizontal: 8,
    padding: "2%",
  },

  keyboardContainer: {
    flex: 1,
  },

  card: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#9b4d75",
    padding: 12,
    marginTop: 8,
  },

  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#9b4d75",
  },

  checkButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#edcece",
  },
  imageContainer: {
    overflow: "hidden",
    marginTop: 8,
  },

  imagePicker: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 20,
  },

  imagePlaceholder: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#9b4d75",
    borderStyle: "dotted",
    backgroundColor: "#edcece",
  },

  imageText: {
    color: "#9b4d75",
    fontSize: 13,
    fontWeight: "500",
  },

  titleInput: {
    borderBottomWidth: 2,
    borderColor: "#9b4d75",
    marginBottom: 18,
    paddingBottom: 6,
    fontSize: 20,
    fontWeight: "600",
  },

  contentInput: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#9b4d75",
    padding: 14,
    borderRadius: 12,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
