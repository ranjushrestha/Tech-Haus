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

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

const SignOutModal = ({ visible, onClose, onConfirm, loading }: Props) => {
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
              <Ionicons name="log-out-outline" size={24} color="#9b4d75" />
            </View>
            <Text style={styles.title}>Sign Out</Text>
            <Text style={styles.message}>
              Are you sure you want to sign out?
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
                style={[styles.signOutButton, loading && { opacity: 0.6 }]}
                onPress={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.signOutText}>Sign Out</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SignOutModal;

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
  signOutButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#9b4d75",
    alignItems: "center",
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
});
