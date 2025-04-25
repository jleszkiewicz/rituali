import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { AuthRoutes } from "@/src/routes/AuthRoutes";
import { AppRoutes } from "@/src/routes/AppRoutes";

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    login(email, password).then(() => {
      router.replace(AppRoutes.Home);
    });
  };

  return (
    <View style={styles.container}>
      <Text>Zaloguj się</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Hasło"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Zaloguj się" onPress={handleLogin} disabled={isLoading} />
      <Button
        title="Załóż konto"
        onPress={() => router.push(AuthRoutes.Register)}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});
