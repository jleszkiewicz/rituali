import React from "react";
import { View, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectChallenges } from "@/src/store/challengesSlice";
import { ThemedText } from "../../Commons/ThemedText";
import Dropdown from "../../Commons/Dropdown";
import { ChallengeData } from "@/components/AddChallengeModal/types";

interface ChallengeSelectorProps {
  isPartOfChallenge: boolean;
  selectedChallengeIds: string[];
  error?: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onToggleChallenge: (challengeId: string) => void;
  onAddChallenge: () => void;
  onTogglePartOfChallenge: () => void;
}

export default function ChallengeSelector({
  isPartOfChallenge,
  selectedChallengeIds,
  error,
  isExpanded,
  onToggleExpanded,
  onToggleChallenge,
  onAddChallenge,
  onTogglePartOfChallenge,
}: ChallengeSelectorProps) {
  const challenges = useSelector(selectChallenges);

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={styles.switchContainer}
        onPress={onTogglePartOfChallenge}
      >
        <ThemedText style={styles.switchText} bold>
          {t("part_of_challenge")}
        </ThemedText>
        <Switch
          value={isPartOfChallenge}
          onValueChange={onTogglePartOfChallenge}
          trackColor={{ false: Colors.LightGray, true: Colors.HotPink }}
        />
      </TouchableOpacity>

      {isPartOfChallenge && (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  switchText: {
    fontSize: 16,
  },
});
