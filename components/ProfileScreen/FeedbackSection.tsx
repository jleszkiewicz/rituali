import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import { t } from "@/src/service/translateService";
import { Ionicons } from "@expo/vector-icons";

interface FeedbackSectionProps {
  onContact: () => void;
}

export default function FeedbackSection({ onContact }: FeedbackSectionProps) {
  const handleContact = async () => {
    try {
      const email = "contact@rituali.app";
      const subject = "Kontakt z zespołem Rituali";
      const body = "Twoja wiadomość:";
      const url = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t("error"), t("email_client_not_available"), [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      Alert.alert(t("error"), t("email_client_not_available"), [
        { text: "OK" },
      ]);
    }
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={[styles.button, styles.contactButton]}
        onPress={handleContact}
      >
        <Ionicons name="mail-outline" size={24} color={Colors.PrimaryGray} />
        <ThemedText style={styles.buttonText}>{t("contact_us")}</ThemedText>
      </TouchableOpacity>
      <ThemedText style={styles.description}>
        {t("contact_description")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  contactButton: {
    backgroundColor: Colors.ButterYellow,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: Colors.White,
    opacity: 0.7,
    marginTop: 10,
    textAlign: "center",
  },
});
