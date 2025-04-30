import { Slot } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { AuthRoutes } from "@/src/routes/AuthRoutes";
import { AppRoutes } from "@/src/routes/AppRoutes";
import "../src/service/translateService";
import { Provider } from "react-redux";
import { store } from "../src/store";

export default function RootLayout() {
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
