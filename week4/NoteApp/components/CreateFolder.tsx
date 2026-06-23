// import { useState } from "react";
// import {
//   Modal,
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useStore } from "@/store/useStore";

// const FOLDER_ICONS = [
//   "folder",
//   "folder-open",
//   "document-text",
//   "images",
//   "star",
//   "heart",
//   "musical-notes",
//   "bulb",
//   "book",
//   "pricetag",
//   "bookmark",
//   "pin",
//   "clipboard",
//   "lock-closed",
//   "sparkles",
// ] as const;

// const ICON_COLORS: Record<string, string> = {
//   folder: "#f59e0b",
//   "folder-open": "#f59e0b",
//   "document-text": "#3b82f6",
//   images: "#10b981",
//   star: "#eab308",
//   heart: "#ef4444",
//   "musical-notes": "#a855f7",
//   bulb: "#fbbf24",
//   book: "#8b5cf6",
//   pricetag: "#06b6d4",
//   bookmark: "#ec4899",
//   pin: "#f97316",
//   clipboard: "#6366f1",
//   "lock-closed": "#14b8a6",
//   sparkles: "#d946ef",
// };

// type Props = {
//   visible: boolean;
//   onClose: () => void;
// };

// const CreateFolder = ({ visible, onClose }: Props) => {
//   const [folderName, setFolderName] = useState("");
//   const [selectedIcon, setSelectedIcon] = useState("folder");
//   const addFolder = useStore((state) => state.addFolder);

//   const generateId = () =>
//     `folder_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

//   const handleCreate = () => {
//     const trimmed = folderName.trim();
//     if (!trimmed) return;

//     addFolder({
//       id: generateId(),
//       name: trimmed,
//       icon: selectedIcon,
//       noteCount: 0,
//       createdAt: new Date().toISOString(),
//     });

//     setFolderName("");
//     setSelectedIcon("folder");
//     onClose();
//   };

//   return (
//     <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
//       <Pressable style={styles.overlay} onPress={onClose}>
//         <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
//           <View style={styles.handleBar} />

//           <Text style={styles.sheetTitle}>New Folder</Text>

//           <View style={styles.inputGroup}>
//             <Ionicons name="pencil" size={16} color="#55557a" />
//             <TextInput
//               style={styles.input}
//               value={folderName}
//               onChangeText={setFolderName}
//               placeholder="Folder name"
//               placeholderTextColor="#55557a"
//               autoFocus
//               maxLength={32}
//             />
//             <Text style={styles.charCount}>{folderName.length}/32</Text>
//           </View>

//           <View style={styles.iconSection}>
//             <Text style={styles.iconLabel}>Choose an icon</Text>
//             <View style={styles.iconGrid}>
//               {FOLDER_ICONS.map((icon) => (
//                 <Pressable
//                   key={icon}
//                   style={[
//                     styles.iconOption,
//                     selectedIcon === icon && [
//                       styles.iconOptionSelected,
//                       { backgroundColor: ICON_COLORS[icon] || "#9b4d75" },
//                     ],
//                   ]}
//                   onPress={() => setSelectedIcon(icon)}
//                 >
//                   <Ionicons
//                     name={icon as any}
//                     size={20}
//                     color={
//                       selectedIcon === icon
//                         ? "#ffffff"
//                         : ICON_COLORS[icon] || "#55557a"
//                     }
//                   />
//                 </Pressable>
//               ))}
//             </View>
//           </View>

//           <Pressable
//             style={[
//               styles.createButton,
//               !folderName.trim() && styles.createButtonDisabled,
//             ]}
//             onPress={handleCreate}
//             disabled={!folderName.trim()}
//           >
//             <Ionicons name="add-circle" size={20} color="#ffffff" />
//             <Text style={styles.createButtonText}>Create Folder</Text>
//           </Pressable>
//         </Pressable>
//       </Pressable>
//     </Modal>
//   );
// };

// export default CreateFolder;

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     justifyContent: "flex-end",
//   },
//   sheet: {
//     backgroundColor: "#0a0a12",
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     paddingHorizontal: 24,
//     paddingBottom: 40,
//     borderTopWidth: 1,
//     borderColor: "#1a1a2e",
//   },
//   handleBar: {
//     width: 36,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: "#2a2a44",
//     alignSelf: "center",
//     marginTop: 12,
//     marginBottom: 20,
//   },
//   sheetTitle: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#ffffff",
//     letterSpacing: -0.4,
//     marginBottom: 24,
//   },
//   inputGroup: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#12121e",
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#2a2a44",
//     paddingHorizontal: 14,
//     height: 50,
//     gap: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: "#ffffff",
//     height: "100%",
//   },
//   charCount: {
//     fontSize: 12,
//     color: "#55557a",
//     fontWeight: "600",
//   },
//   iconSection: {
//     marginTop: 24,
//   },
//   iconLabel: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#55557a",
//     marginBottom: 12,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   iconGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   iconOption: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#12121e",
//     borderWidth: 1,
//     borderColor: "#2a2a44",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconOptionSelected: {
//     borderColor: "transparent",
//   },
//   createButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     backgroundColor: "#9b4d75",
//     borderRadius: 14,
//     height: 50,
//     marginTop: 28,
//   },
//   createButtonDisabled: {
//     opacity: 0.4,
//   },
//   createButtonText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#ffffff",
//   },
// });
