import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import PrimaryButton from "../Commons/PrimaryButton";
import { useSubscription } from "@/src/hooks/useSubscription";
import { useSelector } from "react-redux";
import { selectHabits } from "@/src/store/habitsSlice";
import { selectChallenges } from "@/src/store/challengesSlice";
import { ProFeatureBadge } from "../Commons/ProFeatureBadge";

interface AddOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddHabit: () => void;
  onAddChallenge: () => void;
}

const AddOptionsModal = ({
  isVisible,
  onClose,
  onAddHabit,
  onAddChallenge,
}: AddOptionsModalProps) => {
  const [isConnected, setIsConnected] = useState(true);
  const { isSubscribed, setShowSubscriptionModal } = useSubscription();
  const habits = useSelector(selectHabits);
  const challenges = useSelector(selectChallenges);
  const activeHabits = habits.filter((habit) => habit.status === "active");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activeChallenges = challenges.filter((challenge) => {
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return today >= startDate && today <= endDate;
  });

  const hasReachedHabitLimit = !isSubscribed && activeHabits.length >= 5;
  const hasReachedChallengeLimit =
    !isSubscribed && activeChallenges.length >= 1;

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch("https://www.google.com", {
          method: "HEAD",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (isMounted) {
          setIsConnected(response.ok);
        }
      } catch (error) {
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    if (isVisible) {
      checkConnection();
      const intervalId = setInterval(checkConnection, 3000);
      return () => {
        isMounted = false;
        clearInterval(intervalId);
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;
  if (!isConnected) {
    onClose();
    return null;
  }

  const handleAddHabitPress = () => {
    if (hasReachedHabitLimit) {
      setShowSubscriptionModal(true);
      onClose();
    } else {
      onAddHabit();
    }
  };

  const handleAddChallengePress = () => {
    if (hasReachedChallengeLimit) {
      setShowSubscriptionModal(true);
      onClose();
    } else {
      onAddChallenge();
    }
  };

  return (
    <Pressable style={styles.container} onPress={onClose}>
      <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
        <PrimaryButton
          title={t("add_habit")}
          onPress={handleAddHabitPress}
          style={[styles.option, hasReachedHabitLimit && styles.disabledButton]}
          rightIcon={hasReachedHabitLimit ? <ProFeatureBadge /> : undefined}
        />
        <PrimaryButton
          title={t("add_challenge")}
          onPress={handleAddChallengePress}
          style={[
            styles.option,
            hasReachedChallengeLimit && styles.disabledButton,
          ]}
          rightIcon={hasReachedChallengeLimit ? <ProFeatureBadge /> : undefined}
        />
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <ThemedText style={styles.cancelButtonText}>{t("cancel")}</ThemedText>
        </Pressable>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  content: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  option: {
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelButton: {
    padding: 15,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    textAlign: "center",
  },
});

export default AddOptionsModal;
