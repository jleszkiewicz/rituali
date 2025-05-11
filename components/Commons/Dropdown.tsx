import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface DropdownProps {
  isExpanded: boolean;
  onToggle: () => void;
  selectedText: string;
  placeholder: string;
  items: Array<{
    id: string;
    label: string;
    isSelected?: boolean;
  }>;
  onItemSelect: (id: string) => void;
  noItemsText?: string;
  addButton?: {
    text: string;
    onPress: () => void;
  };
  error?: string;
  expandHeight?: boolean;
  additionalStyle?: StyleProp<ViewStyle>;
}

const Dropdown: React.FC<DropdownProps> = ({
  isExpanded,
  onToggle,
  selectedText,
  placeholder,
  items,
  onItemSelect,
  noItemsText,
  addButton,
  error,
  expandHeight = false,
  additionalStyle,
}) => {
  return (
    <View>
      <TouchableOpacity style={styles.dropdownHeader} onPress={onToggle}>
        <ThemedText style={styles.dropdownHeaderText}>
          {selectedText || placeholder}
        </ThemedText>
        <ThemedText style={styles.dropdownArrow}>
          {isExpanded ? "▲" : "▼"}
        </ThemedText>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView
          style={[
            styles.dropdownContent,
            expandHeight ? styles.expandHeightContent : styles.absoluteContent,
            additionalStyle,
          ]}
        >
          {items.length === 0 ? (
            <ThemedText style={styles.noItems}>{noItemsText}</ThemedText>
          ) : (
            <>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.dropdownItem,
                    item.isSelected && styles.selectedItem,
                  ]}
                  onPress={() => onItemSelect(item.id)}
                >
                  <ThemedText
                    style={[
                      styles.dropdownItemText,
                      item.isSelected && styles.selectedItemText,
                    ]}
                  >
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
              {addButton && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addButton.onPress}
                >
                  <Ionicons name="add" size={20} color={Colors.White} />
                  <ThemedText style={styles.addButtonText}>
                    {addButton.text}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>
      )}
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
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
    borderColor: Colors.LightGray,
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
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 5,
  },
  absoluteContent: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: Colors.White,
    maxHeight: 200,
    zIndex: 2,
  },
  expandHeightContent: {
    maxHeight: 190,
    marginBottom: 5,
  },
  dropdownItem: {
    padding: 10,
    borderRadius: 5,
    margin: 3,
  },
  selectedItem: {
    backgroundColor: Colors.ButterYellow,
  },
  noItems: {
    padding: 10,
    textAlign: "center",
    color: Colors.PrimaryGray,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  selectedItemText: {
    color: Colors.PrimaryGray,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.HotPink,
    padding: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  addButtonText: {
    color: Colors.White,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  errorText: {
    color: Colors.PrimaryRed,
    fontSize: 12,
    marginTop: 5,
  },
});

export default Dropdown;
