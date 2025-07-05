import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { fetchFriends } from "@/src/service/apiService";
import { t } from "@/src/service/translateService";
import ModalButtons from "../AddChallengeModal/ModalButtons";
import { ThemedText } from "../Commons/ThemedText";
import ModalHeader from "./ChallengeInfoModal/ModalHeader";
import { Ionicons } from "@expo/vector-icons";
import Dropdown from "../Commons/Dropdown";

interface Friend {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completion_percentage: number;
}

interface AddCompetitionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddCompetitionModal = ({
  isVisible,
  onClose,
  onSuccess,
}: AddCompetitionModalProps) => {
  const userId = useSelector(selectUserId);
  const [competitionName, setCompetitionName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);
  const [isFriendsExpanded, setIsFriendsExpanded] = useState(false);
  const [errors, setErrors] = useState<{
    name: string;
    friends: string;
  }>({
    name: "",
    friends: "",
  });

  useEffect(() => {
    const loadFriends = async () => {
      if (userId) {
        try {
          setIsLoadingFriends(true);
          const friendsList = await fetchFriends(userId);
          setFriends(friendsList || []);
        } catch (error) {
          console.error("Error fetching friends:", error);
          setFriends([]);
        } finally {
          setIsLoadingFriends(false);
        }
      }
    };
    loadFriends();
  }, [userId]);

  const handleCloseModal = () => {
    setCompetitionName("");
    setSelectedFriends([]);
    setErrors({
      name: "",
      friends: "",
    });
    onClose();
  };

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
    setErrors((prev) => ({ ...prev, friends: "" }));
  };

  const handleSubmit = async () => {
    const newErrors = {
      name: "",
      friends: "",
    };

    if (!competitionName.trim()) {
      newErrors.name = t("competition_name_required");
    }

    if (selectedFriends.length === 0) {
      newErrors.friends = t("select_friends_required");
    }

    if (newErrors.name || newErrors.friends) {
      setErrors(newErrors);
      return;
    }

    try {
      handleCloseModal();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating competition:", error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.container}>
        <Pressable style={styles.backdrop} onPress={handleCloseModal} />
        <View style={styles.content}>
          <ModalHeader
            title={t("add_competition")}
            onClose={handleCloseModal}
            color={Colors.PrimaryGray}
          />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label} bold>
                {t("competition_name")}
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  errors.name ? styles.inputError : null,
                  { fontFamily: "Poppins-Regular" },
                ]}
                value={competitionName}
                onChangeText={(text) => {
                  setCompetitionName(text);
                  setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name ? (
                <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
              ) : null}
            </View>

            <View style={styles.friendsContainer}>
              <ThemedText style={styles.label} bold>
                {t("select_friends")}
              </ThemedText>
              <Dropdown
                isExpanded={isFriendsExpanded}
                onToggle={() => setIsFriendsExpanded(!isFriendsExpanded)}
                selectedText={
                  selectedFriends.length > 0
                    ? `${t("selected_friends")}: ${selectedFriends.length}`
                    : ""
                }
                placeholder={t("select_friends")}
                items={friends.map((friend) => ({
                  id: friend.id,
                  label: friend.display_name || "Unknown User",
                  isSelected: selectedFriends.includes(friend.id),
                }))}
                onItemSelect={handleFriendToggle}
                noItemsText={
                  isLoadingFriends ? t("loading") : t("no_friends_available")
                }
                error={errors.friends}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonsContainer}>
            <ModalButtons onCancel={handleCloseModal} onSubmit={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  content: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    width: "100%",
    maxHeight: "90%",
  },
  scrollView: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.PrimaryGray,
    fontFamily: "Poppins-Regular",
  },
  inputError: {
    borderColor: Colors.PrimaryRed,
  },
  errorText: {
    color: Colors.PrimaryRed,
    fontSize: 14,
    marginTop: 4,
  },
  friendsContainer: {
    marginBottom: 20,
  },
  buttonsContainer: {
    paddingBottom: 20,
  },
});

export default AddCompetitionModal;
