import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";

interface PricingOptionProps {
  type: "monthly" | "yearly";
  price: string;
  isSelected: boolean;
  isRecommended?: boolean;
  onSelect: () => void;
}

export const PricingOption: React.FC<PricingOptionProps> = ({
  type,
  price,
  isSelected,
  isRecommended,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.pricingOption,
        isRecommended && styles.recommended,
        isSelected && styles.selectedOption,
      ]}
      onPress={onSelect}
    >
      {isRecommended && (
        <View style={styles.recommendedBadge}>
          <ThemedText style={styles.recommendedText}>
            {t("best_value")}
          </ThemedText>
        </View>
      )}
      <ThemedText style={styles.pricingTitle} bold>
        {t(type)}
      </ThemedText>
      <ThemedText style={styles.price}>{price}</ThemedText>
      <ThemedText style={styles.period}>
        {t("per")} {type === "monthly" ? t("month") : t("year")}{" "}
        {t("after_free_trial")}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pricingOption: {
    flex: 1,
    backgroundColor: Colors.White,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: Colors.HotPink,
    backgroundColor: Colors.White,
    borderWidth: 3,
  },
  recommended: {},
  recommendedBadge: {
    position: "absolute",
    top: -15,
    backgroundColor: Colors.HotPink,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  recommendedText: {
    color: Colors.White,
    fontSize: 12,
    fontWeight: "bold",
  },
  pricingTitle: {
    fontSize: 18,
    color: Colors.PrimaryGray,
    marginBottom: 5,
    marginTop: 10,
  },
  price: {
    fontSize: 28,
    color: Colors.HotPink,
    fontWeight: "bold",
    marginTop: 5,
    lineHeight: 32,
  },
  period: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.PrimaryGray,
    marginBottom: 5,
    lineHeight: 13,
    opacity: 0.6,
    textAlign: "center",
  },
});
