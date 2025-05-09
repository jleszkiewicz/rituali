import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { AppRoutes } from "@/src/routes/AppRoutes";
import { Colors } from "../../constants/Colors";
import { AuthRoutes } from "@/src/routes/AuthRoutes";
import { t } from "@/src/service/translateService";
import { ThemedText } from "@/components/Commons/ThemedText";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    register(email, password).then(() => {
      router.replace(AppRoutes.Home);
    });
  };

  return (
    <View style={styles.innerContainer}>
      <ThemedText style={styles.title}>{t("register_title")}</ThemedText>
      <TextInput
        style={styles.input}
        placeholder={t("email_placeholder")}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={Colors.PrimaryGray}
      />
      <TextInput
        style={styles.input}
        placeholder={t("password_placeholder")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={Colors.PrimaryGray}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <ThemedText style={styles.buttonText} bold>
          {t("register_button")}
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push(AuthRoutes.Login)}
      >
        <ThemedText style={styles.loginButtonText}>
          {t("login_redirect")}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 50,
    zIndex: 1,
    backgroundColor: Colors.White,
  },
  title: {
    fontSize: 28,
    color: Colors.PrimaryRed,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.White,
    borderColor: Colors.PrimaryPink,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 16,
    color: Colors.Black,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.PrimaryPink,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 18,
  },
  loginButton: {
    marginTop: 10,
  },
  loginButtonText: {
    color: Colors.PrimaryRed,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
