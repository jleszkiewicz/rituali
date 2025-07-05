import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { t } from "@/src/service/translateService";
import { Ionicons } from "@expo/vector-icons";
import ConfirmationModal from "@/components/modals/DeleteAccountModal";
import * as Notifications from "expo-notifications";
import {
  selectUserId,
  selectEmail,
  selectDisplayName,
  clearUserData,
} from "@/src/store/userSlice";
import { useImageUpload } from "@/src/hooks/useImageUpload";
import {
  uploadProfilePhoto,
  fetchProfilePhotoUrl,
} from "@/src/service/apiService";
import { Linking } from "react-native";
import PrimaryButton from "@/components/Commons/PrimaryButton";
import ProfileOption from "@/components/ProfileScreen/ProfileOption";
import {
  requestNotificationPermissions,
  scheduleUncompletedHabitsCheck,
  cancelAllNotifications,
  subscribeToFriendRequestNotifications,
  subscribeToChallengeInvitationNotifications,
} from "@/src/service/notificationsService";

const ProfileScreen = () => {
  const { logout, deleteAccount, updateDisplayName } = useAuth();
  const router = useRouter();
  const userId = useSelector(selectUserId);
  const email = useSelector(selectEmail);
  const displayName = useSelector(selectDisplayName);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(displayName || "");
  const dispatch = useDispatch();
  const { pickImage, isLoading: isUploading } = useImageUpload({
    onError: (error) => Alert.alert(t("error"), error.message),
  });

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const url = await fetchProfilePhotoUrl(userId);
      setAvatarUrl(url);
    })();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      Notifications.getPermissionsAsync().then(({ status }) => {
        setNotificationsEnabled(status === "granted");
      });

      const unsubscribeFriendRequests =
        subscribeToFriendRequestNotifications(userId);
      const unsubscribeChallengeInvitations =
        subscribeToChallengeInvitationNotifications(userId);

      return () => {
        unsubscribeFriendRequests();
        unsubscribeChallengeInvitations();
      };
    }
  }, [userId]);

  const handlePickAvatar = async () => {
    if (!userId) return;
    try {
      const uri = await pickImage();
      if (!uri) return;
      const url = await uploadProfilePhoto(userId, uri);
      setAvatarUrl(url);
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUserData());
      router.replace("/(auth)/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      dispatch(clearUserData());
      router.replace("/(auth)/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert(t("error"), t("name_required"));
      return;
    }

    const result = await updateDisplayName(newName.trim());
    if (result.success) {
      setIsEditingName(false);
    } else {
      Alert.alert(t("error"), result.error || t("update_name_error"));
    }
  };

  const toggleNotifications = async () => {
    try {
      if (!notificationsEnabled) {
        const granted = await requestNotificationPermissions();
        if (granted) {
          setNotificationsEnabled(true);
          if (userId) {
            await scheduleUncompletedHabitsCheck(userId);
          }
        } else {
          Alert.alert(t("error"), t("notifications_permission_denied"));
        }
      } else {
        await cancelAllNotifications();
        setNotificationsEnabled(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScreenWrapper showOfflineScreen={false}>
      <ScreenHeader title={t("profile")} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeaderContainer}>
          <View style={styles.avatarWrapper}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <Image
                source={require("@/assets/illustrations/avatar.png")}
                style={styles.avatar}
              />
            )}
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={handlePickAvatar}
              disabled={isUploading}
            >
              {isUploading ? (
                <Ionicons name="refresh" size={20} color={Colors.White} />
              ) : (
                <Ionicons name="camera" size={20} color={Colors.White} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            {isEditingName ? (
              <View style={styles.nameEditContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder={t("name_placeholder")}
                  placeholderTextColor={Colors.PrimaryGray}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleUpdateName}
                >
                  <Ionicons name="checkmark" size={24} color={Colors.White} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsEditingName(false);
                    setNewName(displayName || "");
                  }}
                >
                  <Ionicons name="close" size={24} color={Colors.White} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.nameContainer}
                onPress={() => setIsEditingName(true)}
              >
                <ThemedText style={styles.profileName} bold>
                  {displayName || "User"}
                </ThemedText>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.PrimaryGray}
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <ProfileOption
            icon={"mail-outline" as keyof typeof Ionicons.glyphMap}
            label={t("contact_us")}
            onPress={() => Linking.openURL("mailto:rituali@contact")}
          />
          <View style={styles.switchRow}>
            <View style={styles.leftSwitchConatiner}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={Colors.PrimaryGray}
                style={{ width: 28 }}
              />
              <ThemedText style={styles.optionLabel}>
                {t("notifications")}
              </ThemedText>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: Colors.LightGray, true: Colors.HotPink }}
              thumbColor={Colors.White}
            />
          </View>
          <ProfileOption
            icon={"trash" as keyof typeof Ionicons.glyphMap}
            label={t("delete_account")}
            onPress={() => setIsDeleteModalVisible(true)}
            shouldShowBottomBorder={false}
          />
        </View>
        <PrimaryButton onPress={handleLogout} style={styles.logoutRow}>
          <Ionicons name="log-out-outline" size={22} color={Colors.White} />
          <ThemedText style={styles.logoutText}>{t("logout")}</ThemedText>
        </PrimaryButton>
      </ScrollView>
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
        title={t("delete_account_confirmation_title")}
        message={t("delete_account_confirmation_message")}
        confirmText={t("delete")}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  profileHeaderContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: "relative",
    width: 140,
    height: 140,
    marginBottom: 10,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 5,
    borderColor: Colors.ButterYellow,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.HotPink,
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: Colors.White,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 8,
  },
  profileName: {
    fontSize: 20,
    color: Colors.PrimaryGray,
  },
  profileUsername: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    opacity: 0.7,
    marginTop: 2,
  },
  editProfileButton: {
    backgroundColor: Colors.HotPink,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  editProfileButtonText: {
    color: Colors.White,
    fontWeight: "bold",
    fontSize: 16,
  },
  optionsContainer: {
    backgroundColor: Colors.OffWhite,
    borderRadius: 16,
    margin: 2,
    marginBottom: 24,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  optionLabel: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    marginLeft: 12,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 24,
    gap: 8,
    width: "50%",
    alignSelf: "center",
    backgroundColor: Colors.HotPink,
  },
  logoutText: {
    color: Colors.White,
    fontSize: 18,
    fontWeight: "bold",
    marginStart: 10,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingStart: 24,
    paddingEnd: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
  },
  leftSwitchConatiner: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editIcon: {
    marginLeft: 4,
    marginBottom: 6,
  },
  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameInput: {
    backgroundColor: Colors.White,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 20,
    color: Colors.Black,
    minWidth: 150,
  },
  saveButton: {
    backgroundColor: Colors.HotPink,
    borderRadius: 8,
    padding: 8,
  },
  cancelButton: {
    backgroundColor: Colors.PrimaryRed,
    borderRadius: 8,
    padding: 8,
  },
});

export default ProfileScreen;
