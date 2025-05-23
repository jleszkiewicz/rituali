import React, { useState } from "react";
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
import { removeFriend } from "@/src/service/apiService";
import { RemoveFriendModal } from "./RemoveFriendModal";

interface Friend {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface FriendsListProps {
  friends: Friend[];
  onFriendRemoved: () => void;
}

const FriendsList = ({ friends, onFriendRemoved }: FriendsListProps) => {
  const userId = useSelector(selectUserId);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const handleRemoveFriend = async (friendId: string) => {
    if (!userId) return;
    setSelectedFriendId(friendId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = async () => {
    if (!userId || !selectedFriendId) return;

    try {
      await removeFriend(userId, selectedFriendId);
      onFriendRemoved();
    } catch (error) {
      console.error("Error removing friend:", error);
    } finally {
      setShowRemoveModal(false);
      setSelectedFriendId(null);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setSelectedFriendId(null);
  };

  const renderFriend = ({ item }: { item: Friend }) => (
    <View style={styles.friendItem}>
      <View style={styles.userInfo}>
        <Image
          source={
            item.avatar_url
              ? { uri: item.avatar_url }
              : require("@/assets/ilustrations/avatar.png")
          }
          style={styles.avatar}
        />
        <ThemedText style={styles.userName}>
          {item.display_name || "User"}
        </ThemedText>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFriend(item.id)}
      >
        <ThemedText style={styles.removeButtonText} bold>
          {t("remove")}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  if (friends.length === 0) return null;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle} bold>
        {t("friends")}
      </ThemedText>
      <FlatList
        data={friends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
      <RemoveFriendModal
        visible={showRemoveModal}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: Colors.PrimaryGray,
  },
  friendItem: {
    backgroundColor: Colors.White,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
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
  removeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.HotPink,
  },
  removeButtonText: {
    color: Colors.HotPink,
    fontSize: 14,
  },
});

export default FriendsList;
