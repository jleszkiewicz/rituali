import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { removeFriend, canSendPoke, sendPoke } from "@/src/service/apiService";
import { t } from "@/src/service/translateService";
import { FriendCard } from "./FriendCard";
import { Colors } from "@/constants/Colors";
import { RemoveFriendModal } from "./RemoveFriendModal";
import { ThemedText } from "../Commons/ThemedText";

interface Friend {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completion_percentage: number;
}

interface FriendsListProps {
  friends: Friend[];
  onFriendRemoved: () => void;
}

const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  onFriendRemoved,
}) => {
  const userId = useSelector(selectUserId);
  const [isPoking, setIsPoking] = useState<string | null>(null);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState<string | null>(null);

  const handlePoke = async (friendId: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      setIsPoking(friendId);
      const canPoke = await canSendPoke(userId, friendId);

      if (!canPoke) {
        return false;
      }

      const success = await sendPoke(userId, friendId);
      return success;
    } catch (error) {
      console.error("Error sending poke:", error);
      return false;
    } finally {
      setIsPoking(null);
    }
  };

  const handleRemove = (friendId: string) => {
    if (!userId) return;
    setFriendToRemove(friendId);
    setRemoveModalVisible(true);
  };

  const confirmRemove = async () => {
    if (!userId || !friendToRemove) return;

    try {
      await removeFriend(userId, friendToRemove);
      onFriendRemoved();
    } catch (error) {
      console.error("Error removing friend:", error);
    } finally {
      setRemoveModalVisible(false);
      setFriendToRemove(null);
    }
  };

  if (friends.length === 0) {
    return null;
  }

  return (
    <View>
      <ThemedText style={styles.title} bold>
        {t("friends_list")}
      </ThemedText>
      {friends.map((friend) => (
        <FriendCard
          key={friend.id}
          friend={friend}
          onPoke={() => handlePoke(friend.id)}
          onRemove={() => handleRemove(friend.id)}
        />
      ))}

      <RemoveFriendModal
        visible={removeModalVisible}
        onConfirm={confirmRemove}
        onCancel={() => setRemoveModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalIcon: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: Colors.LightGray,
  },
  removeButton: {
    backgroundColor: Colors.PrimaryRed,
  },
  cancelButtonText: {
    color: Colors.PrimaryGray,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  removeButtonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    color: Colors.PrimaryGray,
  },
});

export default FriendsList;
