import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface DropdownItem {
  id: string;
  label: string;
  isSelected: boolean;
}

interface DropdownProps {
  isExpanded: boolean;
  onToggle: () => void;
  selectedText: string;
  placeholder: string;
  items: DropdownItem[];
  onItemSelect: (id: string) => void;
  noItemsText: string;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  isExpanded,
  onToggle,
  selectedText,
  placeholder,
  items,
  onItemSelect,
  noItemsText,
  error,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, error ? styles.headerError : null]}
        onPress={onToggle}
      >
        <ThemedText
          style={[
            styles.selectedText,
            !selectedText ? styles.placeholder : null,
          ]}
        >
          {selectedText || placeholder}
        </ThemedText>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={Colors.PrimaryGray}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.dropdown}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            {items.length > 0 ? (
              items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.item,
                    item.isSelected ? styles.selectedItem : null,
                  ]}
                  onPress={() => onItemSelect(item.id)}
                >
                  <ThemedText
                    style={[
                      styles.itemText,
                      item.isSelected ? styles.selectedItemText : null,
                    ]}
                  >
                    {item.label}
                  </ThemedText>
                  {item.isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={24}
                      color={Colors.HotPink}
                    />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noItemsContainer}>
                <ThemedText style={styles.noItemsText}>
                  {noItemsText}
                </ThemedText>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 10,
    backgroundColor: Colors.White,
  },
  headerError: {
    borderColor: Colors.HotPink,
  },
  selectedText: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    flex: 1,
  },
  placeholder: {
    color: Colors.LightGray,
  },
  dropdown: {
    backgroundColor: Colors.White,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.LightGray,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: Colors.PrimaryGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  selectedItem: {
    backgroundColor: Colors.ButterYellow,
  },
  itemText: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    flex: 1,
  },
  selectedItemText: {
    color: Colors.HotPink,
    fontWeight: "600",
  },
  noItemsContainer: {
    padding: 16,
    alignItems: "center",
  },
  noItemsText: {
    fontSize: 16,
    color: Colors.LightGray,
  },
  errorText: {
    color: Colors.HotPink,
    fontSize: 14,
    marginTop: 5,
  },
});

export default Dropdown;
