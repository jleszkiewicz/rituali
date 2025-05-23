import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import { FriendRequestModal } from "./FriendRequestModal";
import { sendFriendRequest } from "@/src/service/apiService";

const FriendRequestForm = () => {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendFriendRequest = async () => {
    if (!userId.trim()) {
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setIsLoading(true);

    try {
      await sendFriendRequest(userId);
      setUserId("");
      setIsSuccess(true);
      setShowModal(true);
    } catch (err) {
      setIsSuccess(false);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Image
          source={require("@/assets/ilustrations/friends.png")}
          style={styles.image}
        />
        <ThemedText style={styles.title} bold>
          {t("add_firends_title")}
        </ThemedText>
        <ThemedText style={styles.description}>
          {t("add_firends_description")}
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder={t("enter_user_id")}
          value={userId}
          onChangeText={setUserId}
          placeholderTextColor={Colors.PrimaryGray}
        />
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSendFriendRequest}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? t("sending") : t("send_friend_request")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <FriendRequestModal
        visible={showModal}
        isSuccess={isSuccess}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    gap: 10,
    backgroundColor: Colors.PrimaryGray,
    padding: 16,
    borderRadius: 10,
  },
  input: {
    backgroundColor: Colors.White,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.LightGray,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.HotPink,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 160,
    height: 160,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    color: Colors.White,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: Colors.White,
  },
});

export default FriendRequestForm;
