import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { Ionicons } from "@expo/vector-icons";
import SubscriptionModal from "@/components/Commons/SubscriptionModal/SubscriptionModal";
import { iapService } from "@/src/service/iapService";
import { format } from "date-fns";

interface SubscriptionInfo {
  isActive: boolean;
  type: "monthly" | "yearly" | null;
  startDate: Date | null;
  endDate: Date | null;
  autoRenew: boolean;
}

interface SubscriptionSectionProps {
  userId: string;
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  userId,
}) => {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    isActive: false,
    type: null,
    startDate: null,
    endDate: null,
    autoRenew: false,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionInfo();
  }, [userId]);

  const loadSubscriptionInfo = async () => {
    try {
      setIsLoading(true);
      await iapService.initialize();

      const mockSubscription: SubscriptionInfo = {
        isActive: false,
        type: null,
        startDate: null,
        endDate: null,
        autoRenew: false,
      };

      setSubscriptionInfo(mockSubscription);
    } catch (error) {
      console.error("Error loading subscription info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (type: "monthly" | "yearly") => {
    try {
      console.log(`User subscribed to ${type} plan`);

      await loadSubscriptionInfo();

      Alert.alert(t("success"), t("subscription_updated_successfully"), [
        { text: t("ok") },
      ]);
    } catch (error) {
      console.error("Error updating subscription:", error);
      Alert.alert(t("error"), t("subscription_update_failed"));
    }
  };

  const handleStartTrial = async () => {
    try {
      console.log("Starting trial period");

      Alert.alert(t("success"), t("trial_started_successfully"), [
        { text: t("ok") },
      ]);
    } catch (error) {
      console.error("Error starting trial:", error);
      Alert.alert(t("error"), t("trial_start_failed"));
    }
  };

  const handleManageSubscription = () => {
    Alert.alert(
      t("manage_subscription"),
      t("manage_subscription_description"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("open_settings"),
          onPress: () => {
            console.log("Opening subscription settings");
          },
        },
      ]
    );
  };

  const renderSubscriptionStatus = () => {
    if (isLoading) {
      return (
        <View style={styles.statusContainer}>
          <ThemedText style={styles.statusText}>{t("loading")}...</ThemedText>
        </View>
      );
    }

    if (subscriptionInfo.isActive) {
      return (
        <View style={styles.statusContainer}>
          <View style={styles.activeStatus}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.HotPink}
            />
            <ThemedText style={styles.activeStatusText}>
              {t("subscription_active")}
            </ThemedText>
          </View>

          <View style={styles.subscriptionDetails}>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>
                {t("plan_type")}:
              </ThemedText>
              <ThemedText style={styles.detailValue}>
                {subscriptionInfo.type === "monthly"
                  ? t("monthly")
                  : t("yearly")}
              </ThemedText>
            </View>

            {subscriptionInfo.startDate && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>
                  {t("start_date")}:
                </ThemedText>
                <ThemedText style={styles.detailValue}>
                  {format(subscriptionInfo.startDate, "dd.MM.yyyy")}
                </ThemedText>
              </View>
            )}

            {subscriptionInfo.endDate && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>
                  {t("end_date")}:
                </ThemedText>
                <ThemedText style={styles.detailValue}>
                  {format(subscriptionInfo.endDate, "dd.MM.yyyy")}
                </ThemedText>
              </View>
            )}

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>
                {t("auto_renew")}:
              </ThemedText>
              <ThemedText style={styles.detailValue}>
                {subscriptionInfo.autoRenew ? t("yes") : t("no")}
              </ThemedText>
            </View>
          </View>

          <TouchableOpacity
            style={styles.manageButton}
            onPress={handleManageSubscription}
          >
            <ThemedText style={styles.manageButtonText}>
              {t("manage_subscription")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.statusContainer}>
        <View style={styles.inactiveStatus}>
          <Ionicons name="close-circle" size={20} color={Colors.PrimaryRed} />
          <ThemedText style={styles.inactiveStatusText}>
            {t("no_active_subscription")}
          </ThemedText>
        </View>

        <ThemedText style={styles.upgradeDescription}>
          {t("upgrade_to_premium_description")}
        </ThemedText>

        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => setIsModalVisible(true)}
        >
          <ThemedText style={styles.upgradeButtonText}>
            {t("upgrade_to_premium")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons
            name="card-outline"
            size={22}
            color={Colors.PrimaryGray}
            style={{ width: 28 }}
          />
          <ThemedText style={styles.sectionTitle}>
            {t("subscription")}
          </ThemedText>
        </View>

        {renderSubscriptionStatus()}
      </View>

      <SubscriptionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubscribe={handleSubscribe}
        onStartTrial={handleStartTrial}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.OffWhite,
    borderRadius: 16,
    margin: 2,
    marginBottom: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    marginLeft: 12,
    fontWeight: "600",
  },
  statusContainer: {
    alignItems: "center",
  },
  activeStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  activeStatusText: {
    fontSize: 16,
    color: Colors.HotPink,
    fontWeight: "600",
    marginLeft: 8,
  },
  inactiveStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  inactiveStatusText: {
    fontSize: 16,
    color: Colors.PrimaryRed,
    fontWeight: "600",
    marginLeft: 8,
  },
  subscriptionDetails: {
    width: "100%",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    fontWeight: "500",
  },
  manageButton: {
    backgroundColor: Colors.HotPink,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  manageButtonText: {
    color: Colors.White,
    fontSize: 14,
    fontWeight: "600",
  },
  upgradeDescription: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: Colors.HotPink,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  upgradeButtonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "600",
  },
  statusText: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    opacity: 0.7,
  },
});
