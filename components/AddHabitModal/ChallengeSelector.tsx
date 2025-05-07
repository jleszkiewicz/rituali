import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
} from "react-native";
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

interface ChallengeSelectorProps {
  isPartOfChallenge: boolean;
  initialChallenges: string[];
  onChallengeChange: (
    isPartOfChallenge: boolean,
    selectedChallenges: string[]
  ) => void;
}

const ChallengeSelector: React.FC<ChallengeSelectorProps> = ({
  isPartOfChallenge,
  initialChallenges,
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

  const toggleDropdown = () => {
    if (isPartOfChallenge) {
      setIsExpanded(!isExpanded);
    }
  };

  const toggleChallenge = (challengeId: string) => {
    const newSelectedChallenges = initialChallenges.includes(challengeId)
      ? initialChallenges.filter((id) => id !== challengeId)
      : [...initialChallenges, challengeId];

    onChallengeChange(true, newSelectedChallenges);
  };

  const getSelectedChallengesText = () => {
    if (initialChallenges.length === 0) {
      return t("select_challenge");
    }

    const selectedNames = challenges
      .filter((c) => initialChallenges.includes(c.id))
      .map((c) => c.name)
      .join(", ");

    return selectedNames || t("select_challenge");
  };

  return (
    <>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>{t("part_of_challenge")}</Text>
        <Switch
          value={isPartOfChallenge}
          onValueChange={(value) => {
            onChallengeChange(value, []);
            if (!value) {
              setIsExpanded(false);
            }
          }}
          trackColor={{ false: Colors.LightGray, true: Colors.PrimaryPink }}
        />
      </View>

      {isPartOfChallenge && (
        <View>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={toggleDropdown}
          >
            <Text style={styles.dropdownHeaderText}>
              {getSelectedChallengesText()}
            </Text>
            <Text style={styles.dropdownArrow}>{isExpanded ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {isExpanded && (
            <ScrollView style={styles.dropdownContent}>
              {challenges.length === 0 ? (
                <Text style={styles.noChallenges}>{t("no_challenges")}</Text>
              ) : (
                challenges.map((challenge) => (
                  <TouchableOpacity
                    key={challenge.id}
                    style={[
                      styles.dropdownItem,
                      initialChallenges.includes(challenge.id) &&
                        styles.selectedChallenge,
                    ]}
                    onPress={() => toggleChallenge(challenge.id)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        initialChallenges.includes(challenge.id) &&
                          styles.selectedChallengeText,
                      ]}
                    >
                      {challenge.name}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}
        </View>
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
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 5,
    marginBottom: 5,
  },
  dropdownHeaderText: {
    fontSize: 16,
  },
  dropdownArrow: {
    fontSize: 12,
  },
  dropdownContent: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: Colors.White,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 5,
    zIndex: 2,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.Gray,
  },
  selectedChallenge: {
    backgroundColor: Colors.PrimaryPink,
  },
  noChallenges: {
    padding: 10,
    textAlign: "center",
    color: Colors.PrimaryGray,
  },
  switchText: {
    fontSize: 16,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  selectedChallengeText: {
    fontWeight: "bold",
    color: Colors.White,
  },
});

export default ChallengeSelector;
