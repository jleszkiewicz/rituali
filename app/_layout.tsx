import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
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
import { useSubscription } from "@/src/hooks/useSubscription";
import SubscriptionModal from "@/components/Commons/SubscriptionModal/SubscriptionModal";

const PoppinsRegular = require("../assets/fonts/Poppins-Regular.ttf");
const PoppinsBold = require("../assets/fonts/Poppins-Bold.ttf");

function AuthWrapper() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuth();
  const {
    showSubscriptionModal,
    setShowSubscriptionModal,
    subscribe,
    startTrial,
  } = useSubscription();

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

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="habit-summary" />
        <Stack.Screen name="challenge-info" />
        <Stack.Screen name="challenge-summary" />
        <Stack.Screen name="shared-challenge" />
        <Stack.Screen name="shared-challenge-summary" />
      </Stack>
      <SubscriptionModal
        isVisible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={subscribe}
        onStartTrial={startTrial}
      />
    </>
  );
}

function RootLayoutContent() {
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
    <ErrorModalProvider>
      <ErrorProvider>
        <AuthProvider>
          <AuthWrapper />
        </AuthProvider>
      </ErrorProvider>
    </ErrorModalProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}
