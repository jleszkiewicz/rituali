// app/(auth)/_layout.tsx
import { Stack } from "expo-router";

// Layout dla ekranów autentykacji (np. login, rejestracja)
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
