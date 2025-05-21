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
import { AppRoutes } from "@/src/routes/AppRoutes";
import { Colors } from "../../constants/Colors";
import { AuthRoutes } from "@/src/routes/AuthRoutes";
import { t } from "@/src/service/translateService";
import { ThemedText } from "@/components/Commons/ThemedText";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { ErrorModal } from "@/src/components/Commons/ErrorModal";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { showErrorModal, errorMessage, hideError, showError } =
    useErrorModal();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
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

    if (!confirmPassword) {
      newErrors.confirmPassword = t("confirm_password_required");
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t("passwords_dont_match");
    }

    setErrors(newErrors);
    return (
      !newErrors.email && !newErrors.password && !newErrors.confirmPassword
    );
  };

  const handleRegister = async () => {
    if (validateForm()) {
      const result = await register(email, password);
      if (result.success) {
        router.replace(AppRoutes.Home);
      } else if (result.error) {
        showError(result.error);
      }
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.innerContainer}>
        <Image
          source={require("@/assets/ilustrations/register.png")}
          style={styles.image}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            placeholder={t("email_placeholder")}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
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
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
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
        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword ? styles.inputError : null,
              ]}
              placeholder={t("confirm_password")}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              placeholderTextColor={Colors.PrimaryGray}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.icon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color={Colors.PrimaryRed}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? (
            <ThemedText style={styles.errorText}>
              {errors.confirmPassword}
            </ThemedText>
          ) : null}
        </View>
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

      <ErrorModal
        visible={showErrorModal}
        title={t("register_error_title")}
        message={errorMessage}
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
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
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
  loginButton: {
    marginTop: 10,
  },
  loginButtonText: {
    color: Colors.PrimaryRed,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
});
