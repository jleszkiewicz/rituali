import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import CustomModal from "@/components/Commons/CustomModal";

interface FriendCardProps {
  friend: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    completion_percentage: number;
  };
  onPoke: () => Promise<boolean>;
  onRemove: () => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onPoke,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: "success" | "error";
  }>({
    title: "",
    message: "",
    type: "success",
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const showModal = (
    title: string,
    message: string,
    type: "success" | "error"
  ) => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  const handlePoke = async () => {
    try {
      const success = await onPoke();
      if (success) {
        showModal(t("success"), t("poke_sent_success"), "success");
      } else {
        showModal(
          t("poke_limit_reached"),
          t("poke_limit_reached_description"),
          "error"
        );
      }
    } catch (error) {
      showModal(t("error"), t("unknown_error"), "error");
    }
  };

  const handleRemove = async () => {
    onRemove();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <View style={styles.userInfo}>
            <Image
              source={
                friend.avatar_url
                  ? { uri: friend.avatar_url }
                  : require("@/assets/illustrations/avatar.png")
              }
              style={styles.avatar}
            />
            <ThemedText style={styles.name}>
              {friend.display_name || t("unknown_user")}
            </ThemedText>
          </View>
          <TouchableOpacity onPress={toggleExpand} style={styles.moreButton}>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color={Colors.PrimaryGray}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isExpanded && (
        <View style={styles.menu}>
          <View style={styles.menuContent}>
            <TouchableOpacity style={styles.menuItem} onPress={handlePoke}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={Colors.PrimaryGray}
              />
              <ThemedText style={styles.menuText}>{t("poke")}</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleRemove}>
              <Ionicons
                name="person-remove-outline"
                size={20}
                color={Colors.PrimaryGray}
              />
              <ThemedText style={styles.menuText}>
                {t("remove_friend")}
              </ThemedText>
            </TouchableOpacity>

            <View style={styles.completionContainer}>
              <View style={styles.completionHeader}>
                <Ionicons
                  name="stats-chart-outline"
                  size={20}
                  color={Colors.PrimaryGray}
                />
                <ThemedText style={styles.menuText}>
                  {t("completion_rate")}
                </ThemedText>
              </View>
              <View style={styles.progressBar}>
                {friend.completion_percentage > 0 && (
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${friend.completion_percentage}%` },
                    ]}
                  />
                )}
              </View>
              <ThemedText style={styles.percentageText}>
                {Math.round(friend.completion_percentage)}%
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  container: {
    backgroundColor: Colors.LightPink,
    borderRadius: 12,
    shadowColor: Colors.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  moreButton: {
    padding: 8,
  },
  menu: {
    backgroundColor: Colors.White,
    borderRadius: 12,
    shadowColor: Colors.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 8,
    margin: 2,
  },
  menuContent: {
    padding: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 14,
    color: Colors.PrimaryGray,
  },
  completionContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.LightGray,
  },
  completionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.LightGray,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.LightGray,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.HotPink,
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    color: Colors.PrimaryGray,
    textAlign: "right",
  },
});
