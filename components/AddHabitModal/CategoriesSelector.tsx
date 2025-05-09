import { StyleSheet, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { HabitCategory } from "./types";
import { t } from "@/src/service/translateService";
import { useState } from "react";
import { ThemedText } from "../Commons/ThemedText";
import Dropdown from "../Commons/Dropdown";

interface CategoriesSelectorProps {
  initialCategory: HabitCategory;
  onCategoryChange: (category: HabitCategory) => void;
}

const CategoriesSelector = ({
  onCategoryChange,
  initialCategory,
}: CategoriesSelectorProps) => {
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const categories: HabitCategory[] = [
    "health",
    "fitness",
    "beauty",
    "mindfulness",
    "education",
    "self-development",
    "other",
  ];

  return (
    <View style={styles.inputContainer}>
      <ThemedText style={styles.label} bold>
        {t("category")}
      </ThemedText>
      <Dropdown
        isExpanded={isCategoryExpanded}
        onToggle={() => setIsCategoryExpanded(!isCategoryExpanded)}
        selectedText={initialCategory ? t(`category_${initialCategory}`) : ""}
        placeholder={t("select_category")}
        items={categories.map((category) => ({
          id: category,
          label: t(`category_${category}`),
          isSelected: category === initialCategory,
        }))}
        onItemSelect={(id) => {
          onCategoryChange(id as HabitCategory);
          setIsCategoryExpanded(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default CategoriesSelector;
