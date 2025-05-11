import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectChallenges } from "@/src/store/challengesSlice";
import { ThemedText } from "../Commons/ThemedText";
import Dropdown from "../Commons/Dropdown";
import { ChallengeData } from "@/components/AddChallengeModal/types";

interface ChallengeSelectorProps {
  selectedChallengeIds: string[];
  error?: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onToggleChallenge: (challengeId: string) => void;
  onAddChallenge: () => void;
}

export default function ChallengeSelector({
  selectedChallengeIds,
  error,
  isExpanded,
  onToggleExpanded,
  onToggleChallenge,
  onAddChallenge,
}: ChallengeSelectorProps) {
  const challenges = useSelector(selectChallenges);

  return (
    <View style={styles.inputContainer}>
      <ThemedText style={styles.label} bold>
        {t("challenges")}
      </ThemedText>
      <Dropdown
        isExpanded={isExpanded}
        onToggle={onToggleExpanded}
        selectedText={
          selectedChallengeIds.length > 0
            ? `${t("challenges_selected")}: ${selectedChallengeIds.length}`
            : ""
        }
        placeholder={t("select_challenges")}
        items={challenges.map((challenge: ChallengeData) => ({
          id: challenge.id,
          label: challenge.name,
          isSelected: selectedChallengeIds.includes(challenge.id),
        }))}
        onItemSelect={onToggleChallenge}
        noItemsText={t("no_active_challenges")}
        addButton={{
          text: t("add_new_challenge"),
          onPress: onAddChallenge,
        }}
        error={error}
        expandHeight
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    textTransform: "capitalize",
    fontSize: 16,
    marginBottom: 5,
  },
});
