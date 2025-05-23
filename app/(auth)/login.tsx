import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { useErrorModal } from "@/src/context/ErrorModalContext";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { AuthRoutes } from "@/src/routes/AuthRoutes";
import { t } from "@/src/service/translateService";
import { ThemedText } from "@/components/Commons/ThemedText";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import { ErrorModal } from "@/src/components/Commons/ErrorModal";

export default function LoginScreen() {
  const { login, loginWithGoogle } = useAuth();
  const { showErrorModal, errorMessage, showError, hideError } =
    useErrorModal();
  const router = useRouter();
  const [email, setEmail] = useState("asku1997@gmail.com");
  const [password, setPassword] = useState("Werginas1!");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      newErrors.email = t("email_required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("invalid_email");
    }

    if (!password) {
      newErrors.password = t("password_required");
    } else if (password.length < 6) {
      newErrors.password = t("password_too_short");
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      const success = await login(email, password);
      if (!success) {
        showError(t("invalid_credentials"));
      }
    }
  };

  const handleInputChange = (text: string, field: "email" | "password") => {
    if (field === "email") {
      setEmail(text);
    } else {
      setPassword(text);
    }
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <ScreenWrapper>
      <View style={styles.innerContainer}>
        <Image
          source={require("@/assets/ilustrations/login.png")}
          style={styles.image}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            placeholder={t("email_placeholder")}
            value={email}
            onChangeText={(text) => handleInputChange(text, "email")}
            placeholderTextColor={Colors.PrimaryGray}
          />
          {errors.email ? (
            <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder={t("password_placeholder")}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => handleInputChange(text, "password")}
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
          {errors.password ? (
            <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
          ) : null}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>{t("login_button")}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
        >
          <Ionicons
            name="logo-google"
            size={24}
            color={Colors.White}
            style={styles.googleIcon}
          />
          <ThemedText style={styles.buttonText}>
            {t("login_with_google")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push(AuthRoutes.Register)}
        >
          <ThemedText style={styles.registerButtonText}>
            {t("register_redirect")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ErrorModal
        visible={showErrorModal}
        message={errorMessage}
        title={t("login_error_title")}
        onClose={hideError}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.White,
    borderColor: Colors.PrimaryPink,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    color: Colors.Black,
    fontFamily: "Poppins-Regular",
  },
  inputError: {
    borderColor: Colors.PrimaryRed,
  },
  errorText: {
    color: Colors.PrimaryRed,
    fontSize: 14,
    textAlign: "center",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 14,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.HotPink,
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
  googleButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.PrimaryRed,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
    flexDirection: "row",
  },
  googleIcon: {
    marginRight: 10,
  },
  registerButton: {
    marginTop: 10,
  },
  registerButtonText: {
    color: Colors.PrimaryRed,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
