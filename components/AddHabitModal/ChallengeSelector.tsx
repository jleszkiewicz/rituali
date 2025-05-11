import React, { useEffect, useState } from "react";
import { View, Switch, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { fetchUserChallenges } from "@/src/service/apiService";
import { selectUserId } from "@/src/store/userSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  selectChallenges,
  setChallenges,
  setLoading,
  setError,
} from "@/src/store/challengesSlice";
import { AppDispatch } from "@/src/store";
import { ThemedText } from "../Commons/ThemedText";
import Dropdown from "../Commons/Dropdown";

interface ChallengeSelectorProps {
  isPartOfChallenge: boolean;
  initialChallengeId: string | null;
  onChallengeChange: (
    isPartOfChallenge: boolean,
    selectedChallengeId: string | null
  ) => void;
}

const ChallengeSelector: React.FC<ChallengeSelectorProps> = ({
  isPartOfChallenge,
  initialChallengeId,
  onChallengeChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const userId = useSelector(selectUserId);
  const challenges = useSelector(selectChallenges);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isPartOfChallenge) {
      loadChallenges();
    }
  }, [isPartOfChallenge]);

  const loadChallenges = async () => {
    try {
      dispatch(setLoading(true));
      const data = await fetchUserChallenges(userId);
      dispatch(setChallenges(data));
    } catch (error) {
      dispatch(
        setError(error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const toggleChallenge = (challengeId: string) => {
    onChallengeChange(true, challengeId);
  };

  const getSelectedChallengeText = () => {
    if (!initialChallengeId) {
      return "";
    }

    const selectedChallenge = challenges.find(
      (c) => c.id === initialChallengeId
    );
    return selectedChallenge ? selectedChallenge.name : "";
  };

  return (
    <>
      <View style={styles.switchContainer}>
        <ThemedText style={styles.switchText} bold>
          {t("part_of_challenge")}
        </ThemedText>
        <Switch
          value={isPartOfChallenge}
          onValueChange={(value) => {
            onChallengeChange(value, null);
            if (!value) {
              setIsExpanded(false);
            }
          }}
          trackColor={{ false: Colors.LightGray, true: Colors.HotPink }}
        />
      </View>

      {isPartOfChallenge && (
        <Dropdown
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          selectedText={getSelectedChallengeText()}
          placeholder={t("select_challenge")}
          items={challenges.map((challenge) => ({
            id: challenge.id,
            label: challenge.name,
            isSelected: initialChallengeId === challenge.id,
          }))}
          onItemSelect={toggleChallenge}
          noItemsText={t("no_challenges")}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  switchText: {
    fontSize: 16,
  },
});

export default ChallengeSelector;
