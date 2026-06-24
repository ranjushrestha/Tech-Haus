import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  noteTitle?: string;
  loading?: boolean;
  confirmTitle: string;
  description: string;
  confrimText: string;
}

const ConfirmDialogue = ({
  visible,
  onClose,
  onConfirm,
  noteTitle,
  loading,
  confirmTitle,
  description,
  confrimText,
}: Props) => {
  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.iconContainer}>
              <Ionicons name="trash-outline" size={24} color="#9b4d75" />
            </View>
            <Text style={styles.title}>{confirmTitle}</Text>
            <Text style={styles.message}>
              {description}
              {noteTitle ? ` "${noteTitle}"` : ""}
            </Text>
            <View style={styles.actions}>
              <Pressable
                style={[styles.cancelButton, loading && { opacity: 0.6 }]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmButton, loading && { opacity: 0.6 }]}
                onPress={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.confirmText}>{confrimText}</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfirmDialogue;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modal: {
    margin: 20,
    backgroundColor: "#12121e",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    width: "82%",
    borderWidth: 1,
    borderColor: "#2a2a44",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2d1122",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#8888bb",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 28,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8888bb",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#9b4d75",
    alignItems: "center",
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
});
