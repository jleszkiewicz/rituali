import React, { useEffect, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";
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
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const prevTabRef = useRef(activeTab);

  useEffect(() => {
    // Reset animations
    fadeAnim.setValue(0.6);
    scaleAnim.setValue(0.9);

    // Determine slide direction
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const prevIndex = tabs.findIndex((tab) => tab.id === prevTabRef.current);
    const direction = activeIndex > prevIndex ? -1 : 1; // Odwrócony kierunek
    slideAnim.setValue(30 * direction);

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Update previous tab
    prevTabRef.current = activeTab;
  }, [activeTab]);

  return (
    <View style={styles.tabContainer}>
      <BlurView intensity={50} tint="light" style={styles.blurWrapper}>
        <View style={styles.tabButtons}>
          {tabs.map((tab) => (
            <Animated.View
              key={tab.id}
              style={[
                styles.tabButtonWrapper,
                activeTab === tab.id && styles.activeTabButtonWrapper,
                {
                  transform: [
                    {
                      translateX: activeTab === tab.id ? slideAnim : 0,
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === tab.id && styles.activeTabButton,
                ]}
                onPress={() => onTabPress(tab.id)}
              >
                <Animated.View
                  style={{
                    opacity: activeTab === tab.id ? fadeAnim : 1,
                    transform: [
                      {
                        scale: activeTab === tab.id ? scaleAnim : 1,
                      },
                    ],
                  }}
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
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
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
    borderRadius: 12,
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
    color: Colors.PrimaryPink,
    fontWeight: "600",
  },
});

export default TabNavigator;
