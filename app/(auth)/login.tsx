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
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { AuthRoutes } from "@/src/routes/AuthRoutes";
import { useTranslation } from "react-i18next";

export default function LoginScreen() {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    login(email, password).then(() => {
      router.replace(AppRoutes.Home);
    });
  };

  return (
    <View style={styles.innerContainer}>
      <Text style={styles.title}>{t("login_title")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("email_placeholder")}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={Colors.PrimaryGray}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("password_placeholder")}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={Colors.PrimaryGray}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.icon}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color={Colors.PrimaryRed}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{t("login_button")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push(AuthRoutes.Register)}
        disabled={isLoading}
      >
        <Text style={styles.registerButtonText}>{t("register_redirect")}</Text>
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
    fontWeight: "600",
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
    fontWeight: "500",
  },
  registerButton: {
    marginTop: 10,
  },
  passwordContainer: {
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 14,
  },
  registerButtonText: {
    color: Colors.PrimaryRed,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
