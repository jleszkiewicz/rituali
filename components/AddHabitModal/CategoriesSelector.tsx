import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { HabitCategory } from "./types";
import { t } from "@/src/service/translateService";
import { useState } from "react";

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
      <Text style={styles.label}>{t("category")}</Text>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setIsCategoryExpanded(!isCategoryExpanded)}
      >
        <Text style={styles.dropdownHeaderText}>
          {initialCategory
            ? t(`category_${initialCategory}`)
            : t("select_category")}
        </Text>
        <Text style={styles.dropdownArrow}>
          {isCategoryExpanded ? "▲" : "▼"}
        </Text>
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
              <Text>{t(`category_${category}`)}</Text>
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
    borderColor: Colors.Gray,
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
    borderColor: Colors.Gray,
    borderRadius: 5,
    zIndex: 2,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.Gray,
  },
  inputContainer: {
    marginBottom: 15,
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
});

export default CategoriesSelector;
