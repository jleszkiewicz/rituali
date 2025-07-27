import * as React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { LinearGradient } from "expo-linear-gradient";
import { getPricing, formatPrice } from "@/src/constants/Pricing";
import { PricingOption } from "./PricingOption";
import { FeatureList } from "./FeatureList";
import { TrialButton } from "./TrialButton";

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
  const pricing = getPricing(t("language_code"));

  if (!isVisible) return null;

  const handlePlanSelect = (plan: "monthly" | "yearly") => {
    setSelectedPlan(plan);
  };

  return (
    <View style={styles.overlay}>
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

              <TrialButton onPress={onStartTrial} />

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <ThemedText style={styles.closeButtonText}>
                  {t("maybe_later")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
    elevation: 5,
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    elevation: 6,
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
