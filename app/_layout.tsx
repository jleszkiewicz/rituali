import { Slot } from "expo-router";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { ErrorProvider } from "../src/context/ErrorContext";
import { ErrorModalProvider } from "../src/context/ErrorModalContext";
import { AuthRoutes } from "@/src/routes/AuthRoutes";
import { AppRoutes } from "@/src/routes/AppRoutes";
import "../src/service/translateService";
import { Provider } from "react-redux";
import { store } from "../src/store";
import * as Font from "expo-font";
import { Fonts } from "@/src/constants/Fonts";

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
      <ErrorModalProvider>
        <ErrorProvider>
          <AuthProvider>
            <AuthWrapper />
          </AuthProvider>
        </ErrorProvider>
      </ErrorModalProvider>
    </Provider>
  );
}

function AuthWrapper() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === "(auth)";

      if (!isAuthenticated && !inAuthGroup) {
        router.replace(AuthRoutes.Login);
      } else if (isAuthenticated && inAuthGroup) {
        router.replace(AppRoutes.Home);
      }
    }
  }, [isLoading, isAuthenticated, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
