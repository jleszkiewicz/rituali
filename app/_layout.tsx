import { Slot } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { AuthRoutes } from "@/src/routes/AuthRoutes";
import { AppRoutes } from "@/src/routes/AppRoutes";
import "../src/service/translateService";
import { Provider } from "react-redux";
import { store } from "../src/store";
import * as Font from "expo-font";
import { Fonts } from "@/src/constants/Fonts";
import { Colors } from "@/constants/Colors";

const PoppinsRegular = require("../assets/fonts/Poppins-Regular.ttf");
const PoppinsBold = require("../assets/fonts/Poppins-Bold.ttf");

export default function RootLayout() {
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          [Fonts.regular]: PoppinsRegular,
          [Fonts.bold]: PoppinsBold,
        });
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    }
    loadFonts();
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <AuthWrapper />
      </AuthProvider>
    </Provider>
  );
}

function AuthWrapper() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace(AuthRoutes.Login);
      } else {
        router.replace(AppRoutes.Home);
      }
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
