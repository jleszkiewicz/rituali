import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import {
  fetchPendingFriendRequests,
  handleFriendRequest,
} from "@/src/service/apiService";

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface PendingRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender?: User | null;
}

interface PendingFriendRequestsProps {
  onRequestHandled: () => void;
}

const PendingFriendRequests = ({
  onRequestHandled,
}: PendingFriendRequestsProps) => {
  const [requests, setRequests] = React.useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const userId = useSelector(selectUserId);

  const fetchRequests = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const requestsData = await fetchPendingFriendRequests(userId);
      setRequests(requestsData);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const handleRequest = async (requestId: string, accept: boolean) => {
    try {
      await handleFriendRequest(requestId, accept);
      onRequestHandled();
      fetchRequests();
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  const renderRequest = ({ item }: { item: PendingRequest }) => (
    <View style={styles.requestItem}>
      <View style={styles.userInfo}>
        <Image
          source={
            item.sender?.user_metadata?.avatar_url
              ? { uri: item.sender.user_metadata.avatar_url }
              : require("@/assets/ilustrations/avatar.png")
          }
          style={styles.avatar}
        />
        <ThemedText style={styles.userName}>
          {item.sender?.user_metadata?.full_name ||
            item.sender?.email ||
            "User"}
        </ThemedText>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleRequest(item.id, true)}
        >
          <ThemedText style={styles.buttonText} bold>
            {t("accept")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.declineButton]}
          onPress={() => handleRequest(item.id, false)}
        >
          <ThemedText style={styles.declineButtonText} bold>
            {t("decline")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ThemedText>{t("loading")}</ThemedText>
      </View>
    );
  }

  if (requests.length === 0) return null;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle} bold>
        {t("pending_requests")}
      </ThemedText>
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: Colors.PrimaryGray,
  },
  requestItem: {
    backgroundColor: Colors.White,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: Colors.HotPink,
  },
  declineButton: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.HotPink,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 14,
  },
  declineButtonText: {
    color: Colors.HotPink,
    fontSize: 14,
  },
});

export default PendingFriendRequests;
