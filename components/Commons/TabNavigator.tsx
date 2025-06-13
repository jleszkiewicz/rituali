import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";

export interface TabItem {
  id: string;
  label: string;
}

interface TabNavigatorProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={styles.tabContainer}>
      <BlurView intensity={50} tint="light" style={styles.blurWrapper}>
        <View style={styles.tabButtons}>
          {tabs.map((tab) => (
            <View
              key={tab.id}
              style={[
                styles.tabButtonWrapper,
                activeTab === tab.id && styles.activeTabButtonWrapper,
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === tab.id && styles.activeTabButton,
                ]}
                onPress={() => onTabPress(tab.id)}
              >
                <ThemedText
                  style={[
                    styles.tabButtonText,
                    activeTab === tab.id && styles.activeTabButtonText,
                  ]}
                  bold={activeTab === tab.id}
                >
                  {tab.label}
                </ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: 10,
    marginBottom: 20,
  },
  blurWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(245, 245, 245, 1)",
    borderWidth: 1,
    borderColor: "rgba(230, 230, 230, 1)",
  },
  tabButtons: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 2,
  },
  tabButtonWrapper: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 8,
  },
  activeTabButtonWrapper: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  tabButton: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  tabButtonText: {
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
  activeTabButtonText: {
    color: Colors.HotPink,
    fontWeight: "600",
  },
});

export default TabNavigator;
