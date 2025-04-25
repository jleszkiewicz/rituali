import { Slot } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "../src/context/AuthContext"; // Importuj AuthProvider
import { AuthRoutes } from "@/src/routes/AuthRoutes";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

function AuthWrapper() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth(); // Teraz korzystamy z useAuth po opakowaniu w AuthProvider

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Dopiero po zakończeniu ładowania, przekierowujemy do /login, jeśli użytkownik nie jest zalogowany
        router.replace(AuthRoutes.Login); // Pamiętaj o poprawnej ścieżce
      } else {
        // Jeśli użytkownik jest zalogowany, możemy przekierować na główną stronę
        router.replace("/(tabs)/index"); // Przykładowa strona główna po zalogowaniu
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

  return <Slot />; // Jeśli zalogowany, renderujemy resztę aplikacji
}
