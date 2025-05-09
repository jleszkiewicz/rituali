import { ScrollView, TouchableOpacity, StyleSheet, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { HabitCategory } from "./types";
import { t } from "@/src/service/translateService";
import { useState } from "react";
import { ThemedText } from "../Commons/ThemedText";

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
      <ThemedText style={styles.label}>{t("category")}</ThemedText>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setIsCategoryExpanded(!isCategoryExpanded)}
      >
        <ThemedText style={styles.dropdownHeaderText}>
          {initialCategory
            ? t(`category_${initialCategory}`)
            : t("select_category")}
        </ThemedText>
        <ThemedText style={styles.dropdownArrow}>
          {isCategoryExpanded ? "▲" : "▼"}
        </ThemedText>
      </TouchableOpacity>

      {isCategoryExpanded && (
        <ScrollView style={styles.dropdownContent}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                onCategoryChange(category as HabitCategory);
                setIsCategoryExpanded(false);
              }}
            >
              <ThemedText>{t(`category_${category}`)}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.PrimaryGray,
    borderRadius: 5,
    marginBottom: 5,
  },
  dropdownHeaderText: {
    fontSize: 16,
  },
  dropdownArrow: {
    fontSize: 12,
  },
  dropdownContent: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: Colors.White,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: Colors.PrimaryGray,
    borderRadius: 5,
    zIndex: 2,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.PrimaryGray,
  },
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
