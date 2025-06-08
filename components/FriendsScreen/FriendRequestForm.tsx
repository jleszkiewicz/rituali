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
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { sendFriendRequest } from "@/src/service/apiService";
import { useSubscription } from "@/src/hooks/useSubscription";
import { ProFeatureBadge } from "../Commons/ProFeatureBadge";

interface FriendRequestFormProps {
  onRequestSent: () => void;
}

const FriendRequestForm = ({ onRequestSent }: FriendRequestFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const userId = useSelector(selectUserId);
  const { isSubscribed, setShowSubscriptionModal } = useSubscription();

  const handleSendFriendRequest = async () => {
    if (!userId) return;

    if (!isSubscribed) {
      setShowSubscriptionModal(true);
      return;
    }

    if (!email) {
      setError(t("email_required"));
      return;
    }

    if (!email.trim()) {
      setError(t("email_required"));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t("invalid_email"));
      return;
    }

    try {
      setIsLoading(true);
      await sendFriendRequest(userId, email);
      setEmail("");
      setError("");
      setIsSuccess(true);
      setShowModal(true);
      onRequestSent();
    } catch (error: any) {
      setError(error.message || t("error_sending_request"));
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
          source={require("@/assets/illustrations/friends.png")}
          style={styles.image}
        />
        <ThemedText style={styles.title} bold>
          {t("add_friends_title")}
        </ThemedText>
        <ThemedText style={styles.description}>
          {t("add_friends_description")}
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder={t("enter_friend_email")}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={Colors.PrimaryGray}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              (isLoading || !isSubscribed) && styles.buttonDisabled,
            ]}
            onPress={handleSendFriendRequest}
          >
            <ThemedText style={styles.buttonText} bold>
              {isLoading ? t("sending") : t("send_friend_request")}
            </ThemedText>
          </TouchableOpacity>
          {!isSubscribed && <ProFeatureBadge style={styles.badge} />}
        </View>
      </View>

      <FriendRequestModal
        visible={showModal}
        isSuccess={isSuccess}
        error={error}
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
    backgroundColor: Colors.ButterYellow,
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
  buttonContainer: {
    position: "relative",
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
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
  },
  image: {
    width: 160,
    height: 160,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    color: Colors.PrimaryGray,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: Colors.PrimaryGray,
  },
});

export default FriendRequestForm;
