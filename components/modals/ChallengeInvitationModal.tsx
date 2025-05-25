import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import ModalHeader from "./ChallengeInfoModal/ModalHeader";
import { t } from "@/src/service/translateService";
import { respondToChallengeInvitation } from "@/src/service/apiService";
import { useDispatch } from "react-redux";
import { setChallenges } from "@/src/store/challengesSlice";
import { fetchUserChallenges } from "@/src/service/apiService";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";

interface ChallengeInvitationModalProps {
  isVisible: boolean;
  onClose: () => void;
  invitation: {
    id: string;
    challenge: {
      id: string;
      name: string;
      start_date: string;
      end_date: string;
      habits: string[];
      user: {
        id: string;
        display_name: string;
        avatar_url: string;
      };
    };
    sender: {
      id: string;
      display_name: string;
      avatar_url: string;
    };
  };
}

export default function ChallengeInvitationModal({
  isVisible,
  onClose,
  invitation,
}: ChallengeInvitationModalProps) {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const handleResponse = async (status: "accepted" | "rejected") => {
    try {
      await respondToChallengeInvitation(invitation.id, status);

      if (userId) {
        const freshChallenges = await fetchUserChallenges(userId);
        dispatch(setChallenges(freshChallenges));
      }

      onClose();
    } catch (error) {
      console.error("Error responding to challenge invitation:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.container}>
        <TouchableWithoutFeedback>
          <View style={styles.content}>
            <ModalHeader
              title={t("challenge_invitation")}
              onClose={onClose}
              color={Colors.PrimaryGray}
            />

            <View style={styles.body}>
              <ThemedText style={styles.message}>
                {t("challenge_invitation_from", {
                  name: invitation.sender.display_name,
                })}
              </ThemedText>

              <View style={styles.challengeInfo}>
                <ThemedText style={styles.challengeName}>
                  {invitation.challenge.name}
                </ThemedText>
                <ThemedText style={styles.challengeDates}>
                  {t("challenge_dates", {
                    start: invitation.challenge.start_date,
                    end: invitation.challenge.end_date,
                  })}
                </ThemedText>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableWithoutFeedback
                  onPress={() => handleResponse("rejected")}
                >
                  <View style={[styles.button, styles.rejectButton]}>
                    <ThemedText style={styles.buttonText}>
                      {t("reject")}
                    </ThemedText>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() => handleResponse("accepted")}
                >
                  <View style={[styles.button, styles.acceptButton]}>
                    <ThemedText style={styles.buttonText}>
                      {t("accept")}
                    </ThemedText>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    backgroundColor: Colors.White,
    borderRadius: 20,
    width: "90%",
    maxWidth: 400,
    padding: 20,
  },
  body: {
    paddingVertical: 20,
  },
  message: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    textAlign: "center",
    marginBottom: 20,
  },
  challengeInfo: {
    backgroundColor: Colors.LightGray,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  challengeName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PrimaryGray,
    marginBottom: 8,
  },
  challengeDates: {
    fontSize: 14,
    color: Colors.SecondaryGray,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: Colors.LightGray,
  },
  acceptButton: {
    backgroundColor: Colors.HotPink,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.White,
  },
});
