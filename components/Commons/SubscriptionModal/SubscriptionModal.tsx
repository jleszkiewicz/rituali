import * as React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { LinearGradient } from "expo-linear-gradient";
import { getPricing, formatPrice } from "@/src/constants/Pricing";
import { PricingOption } from "./PricingOption";
import { FeatureList } from "./FeatureList";
import { TrialButton } from "./TrialButton";
import { iapService } from "@/src/service/iapService";

interface SubscriptionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubscribe: (type: "monthly" | "yearly") => void;
  onStartTrial: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isVisible,
  onClose,
  onSubscribe,
  onStartTrial,
}: SubscriptionModalProps) => {
  const [selectedPlan, setSelectedPlan] = React.useState<"monthly" | "yearly">(
    "yearly"
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const pricing = getPricing(t("language_code"));

  const handlePlanSelect = (plan: "monthly" | "yearly") => {
    setSelectedPlan(plan);
  };

  const handlePurchase = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await iapService.initialize();

      const purchase = await iapService.purchaseSubscription(selectedPlan);

      await iapService.finishTransaction(purchase);

      const isValid = await iapService.validateReceipt(purchase);

      if (isValid) {
        Alert.alert(t("success"), t("subscription_purchased_successfully"), [
          {
            text: t("ok"),
            onPress: () => {
              onSubscribe(selectedPlan);
              onClose();
            },
          },
        ]);
      } else {
        throw new Error("Receipt validation failed");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      Alert.alert(
        t("error"),
        error instanceof Error ? error.message : t("purchase_failed"),
        [{ text: t("ok") }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.HotPink, Colors.ButterYellow]}
          style={styles.gradient}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <ThemedText style={styles.title} bold>
                {t("start_your_membership")}
              </ThemedText>

              <ThemedText style={styles.description}>
                {t("subscription_description")}
              </ThemedText>

              <FeatureList />

              <View style={styles.pricingContainer}>
                <PricingOption
                  type="monthly"
                  price={formatPrice(
                    pricing.monthly.amount,
                    pricing.monthly.currencySymbol
                  )}
                  isSelected={selectedPlan === "monthly"}
                  onSelect={() => handlePlanSelect("monthly")}
                />
                <PricingOption
                  type="yearly"
                  price={formatPrice(
                    pricing.yearly.amount,
                    pricing.yearly.currencySymbol
                  )}
                  isSelected={selectedPlan === "yearly"}
                  isRecommended
                  onSelect={() => handlePlanSelect("yearly")}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.purchaseButton,
                  isLoading && styles.purchaseButtonDisabled,
                ]}
                onPress={handlePurchase}
                disabled={isLoading}
              >
                <ThemedText
                  style={[
                    styles.purchaseButtonText,
                    isLoading && styles.purchaseButtonTextDisabled,
                  ]}
                >
                  {isLoading ? t("processing") : t("start_your_membership")}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <ThemedText style={styles.closeButtonText}>
                  {t("maybe_later")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: Colors.White,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 20,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: Colors.White,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.9,
  },
  pricingContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  purchaseButton: {
    backgroundColor: Colors.ButterYellow,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 50,
  },
  purchaseButtonDisabled: {
    backgroundColor: Colors.LightGray,
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: Colors.PrimaryGray,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  purchaseButtonTextDisabled: {
    color: Colors.PrimaryGray,
    opacity: 0.6,
  },
  closeButton: {
    padding: 15,
  },
  closeButtonText: {
    color: Colors.HotPink,
    fontSize: 16,
    opacity: 0.8,
  },
});

export default SubscriptionModal;
