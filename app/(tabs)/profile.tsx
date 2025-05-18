import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { useSelector } from "react-redux";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { t } from "@/src/service/translateService";
import { Ionicons } from "@expo/vector-icons";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import * as Notifications from "expo-notifications";
import { selectUserId, selectEmail } from "@/src/store/userSlice";
import FeedbackSection from "@/components/ProfileScreen/FeedbackSection";

const ProfileScreen = () => {
  const { logout, deleteAccount } = useAuth();
  const router = useRouter();
  const userId = useSelector(selectUserId);
  const email = useSelector(selectEmail);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert(t("error"), t("logout_error"));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert(t("error"), t("delete_account_error"));
    }
  };

  const toggleNotifications = async () => {
    try {
      if (!notificationsEnabled) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted") {
          setNotificationsEnabled(true);
        } else {
          Alert.alert(t("error"), t("notifications_permission_denied"));
        }
      } else {
        setNotificationsEnabled(false);
      }
    } catch (error) {
      Alert.alert(t("error"), t("notifications_error"));
    }
  };

  return (
    <ScreenWrapper>
      <ScreenHeader title={t("profile")} />
      <View style={styles.container}>
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>{t("email")}</ThemedText>
            <ThemedText style={styles.settingValue}>{email}</ThemedText>
          </View>

          <View style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>
              {t("notifications")}
            </ThemedText>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: Colors.LightGray, true: Colors.HotPink }}
              thumbColor={Colors.White}
            />
          </View>
        </View>

        <FeedbackSection onContact={() => {}} />

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={Colors.White} />
            <ThemedText style={styles.buttonText}>{t("logout")}</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => setIsDeleteModalVisible(true)}
          >
            <Ionicons name="trash-outline" size={24} color={Colors.HotPink} />
            <ThemedText style={[styles.buttonText, styles.deleteButtonText]}>
              {t("delete_account")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
        title={t("delete_account_confirmation_title")}
        message={t("delete_account_confirmation_message")}
        confirmText={t("delete_account")}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.White,
  },
  settingValue: {
    fontSize: 16,
    color: Colors.White,
    opacity: 0.7,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  logoutButton: {
    backgroundColor: Colors.HotPink,
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.HotPink,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.White,
    fontWeight: "bold",
  },
  deleteButtonText: {
    color: Colors.HotPink,
  },
});

export default ProfileScreen;
