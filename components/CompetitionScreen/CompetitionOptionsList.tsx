import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
} from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";
import {
  authorizeGoogleFit,
  fetchFitnessData,
  openGoogleFitApp,
  isGoogleFitAvailable,
} from "../../src/service/googleFitService";

interface CompetitionOption {
  id: string;
  titleKey: string;
  icon: string;
  isAvailable: boolean;
}

const EmptyState: React.FC<{ onCheckPermissions: () => void }> = ({
  onCheckPermissions,
}) => {
  const handleOpenSettings = async () => {
    console.log("Opening settings...");
    if (Platform.OS === "ios") {
      await Linking.openURL("app-settings:");
    } else {
      await Linking.openSettings();
    }
  };

  const handleOpenGoogleFit = async () => {
    console.log("Opening Google Fit...");
    await openGoogleFitApp();
  };

  return (
    <View style={styles.emptyStateContainer}>
      <Image
        source={require("@/assets/illustrations/empty_list.png")}
        style={styles.emptyStateImage}
      />
      <ThemedText style={styles.emptyStateTitle} bold>
        {t("no_competition_data")}
      </ThemedText>
      <ThemedText style={styles.emptyStateDescription}>
        {Platform.OS === "ios"
          ? t("no_competition_data_description_ios")
          : t("no_competition_data_description")}
      </ThemedText>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleOpenSettings}
        >
          <Ionicons name="settings-outline" size={20} color={Colors.White} />
          <ThemedText style={styles.settingsButtonText}>
            {t("open_settings")}
          </ThemedText>
        </TouchableOpacity>
        {Platform.OS === "android" && (
          <>
            <TouchableOpacity
              style={[styles.settingsButton, styles.googleFitButton]}
              onPress={handleOpenGoogleFit}
            >
              <Ionicons name="fitness-outline" size={20} color={Colors.White} />
              <ThemedText style={styles.settingsButtonText}>
                {t("open_google_fit")}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingsButton, styles.checkPermissionsButton]}
              onPress={onCheckPermissions}
            >
              <Ionicons name="refresh-outline" size={20} color={Colors.White} />
              <ThemedText style={styles.settingsButtonText}>
                {t("check_permissions")}
              </ThemedText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const CompetitionOptionsList: React.FC = () => {
  const [options, setOptions] = useState<CompetitionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const checkGoogleFitAvailability = useCallback(async () => {
    if (isLoading) {
      console.log("Already checking permissions, skipping...");
      setDebugInfo(
        (prev) => prev + "\nAlready checking permissions, skipping..."
      );
      return;
    }

    try {
      console.log("=== STARTING GOOGLE FIT CHECK ===");
      setDebugInfo("=== STARTING GOOGLE FIT CHECK ===\n");
      setIsLoading(true);

      if (Platform.OS === "ios") {
        console.log("iOS detected - Google Fit is not available");
        setDebugInfo(
          (prev) => prev + "\nPlatform: iOS - Google Fit is not available"
        );
        setOptions([]);
        return;
      }

      // First check if Google Fit is available
      console.log("Checking if Google Fit is available...");
      setDebugInfo((prev) => prev + "\nChecking if Google Fit is available...");
      const isAvailable = await isGoogleFitAvailable();
      console.log("Google Fit available:", isAvailable);
      setDebugInfo((prev) => prev + "\nGoogle Fit available: " + isAvailable);

      if (!isAvailable) {
        console.log("Google Fit is not available on this device");
        setDebugInfo(
          (prev) => prev + "\nGoogle Fit is not available on this device"
        );
        setOptions([]);
        return;
      }

      console.log("Attempting to authorize Google Fit...");
      setDebugInfo((prev) => prev + "\nAttempting to authorize Google Fit...");
      const isAuthorized = await authorizeGoogleFit();
      console.log("Google Fit authorization result:", isAuthorized);
      setDebugInfo(
        (prev) => prev + "\nGoogle Fit authorization result: " + isAuthorized
      );

      if (!isAuthorized) {
        console.log("Google Fit authorization failed");
        setDebugInfo((prev) => prev + "\nGoogle Fit authorization failed");
        setOptions([]);
        return;
      }

      console.log("Fetching fitness data...");
      setDebugInfo((prev) => prev + "\nFetching fitness data...");
      const fitnessData = await fetchFitnessData();
      console.log(
        "Raw fitness data received:",
        JSON.stringify(fitnessData, null, 2)
      );
      setDebugInfo(
        (prev) =>
          prev + "\nFitness data received: " + (fitnessData ? "yes" : "no")
      );

      if (!fitnessData) {
        console.log("Failed to fetch fitness data");
        setDebugInfo((prev) => prev + "\nFailed to fetch fitness data");
        setOptions([]);
        return;
      }

      const hasSteps = fitnessData.steps > 0;
      const hasCalories = fitnessData.calories > 0;

      console.log("Data check:", {
        hasSteps,
        hasCalories,
        steps: fitnessData.steps,
        calories: fitnessData.calories,
        distance: fitnessData.distance,
      });

      setDebugInfo(
        (prev) =>
          prev +
          "\nData check: steps=" +
          hasSteps +
          ", calories=" +
          hasCalories +
          ", data=" +
          JSON.stringify(fitnessData, null, 2)
      );

      if (!hasSteps && !hasCalories) {
        console.log("No fitness data available (steps or calories)");
        setDebugInfo(
          (prev) => prev + "\nNo fitness data available (steps or calories)"
        );
        setOptions([]);
        return;
      }

      console.log("Setting up competition options...");
      setDebugInfo((prev) => prev + "\nSetting up competition options...");
      const availableOptions: CompetitionOption[] = [];

      if (hasSteps) {
        console.log("Adding steps option");
        setDebugInfo((prev) => prev + "\nAdding steps option");
        availableOptions.push({
          id: "steps",
          titleKey: "competition_steps",
          icon: "footsteps-outline",
          isAvailable: true,
        });
      }

      if (hasCalories) {
        console.log("Adding calories option");
        setDebugInfo((prev) => prev + "\nAdding calories option");
        availableOptions.push({
          id: "calories",
          titleKey: "competition_calories",
          icon: "flame-outline",
          isAvailable: true,
        });
      }

      setOptions(availableOptions);
      console.log("Competition options set successfully:", availableOptions);
      setDebugInfo((prev) => prev + "\nCompetition options set successfully");
      console.log("=== GOOGLE FIT CHECK COMPLETED ===");
      setDebugInfo((prev) => prev + "\n=== GOOGLE FIT CHECK COMPLETED ===");
    } catch (error) {
      console.error("Error in checkGoogleFitAvailability:", error);
      setDebugInfo(
        (prev) =>
          prev +
          "\nError: " +
          (error instanceof Error ? error.message : String(error))
      );
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleOptionPress = (optionId: string) => {
    console.log("Selected option:", optionId);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.debugText}>{t("loading")}</ThemedText>
      </View>
    );
  }

  if (options.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState onCheckPermissions={checkGoogleFitAvailability} />
        <View style={styles.debugContainer}>
          <ThemedText style={styles.debugTitle}>Debug Information:</ThemedText>
          <ThemedText style={styles.debugText}>{debugInfo}</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.optionButton}
          onPress={() => handleOptionPress(option.id)}
        >
          <View style={styles.optionContent}>
            <Ionicons
              name={option.icon as any}
              size={24}
              color={Colors.PrimaryGray}
            />
            <ThemedText style={styles.optionTitle}>
              {t(option.titleKey)}
            </ThemedText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={Colors.PrimaryGray}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.White,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.LightGray,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.PrimaryGray,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    color: Colors.PrimaryGray,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.PrimaryGray,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  googleFitButton: {
    backgroundColor: Colors.Blue,
  },
  checkPermissionsButton: {
    backgroundColor: Colors.Green,
  },
  settingsButtonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  debugContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.LightGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.PrimaryGray,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.PrimaryGray,
    marginBottom: 8,
  },
  debugText: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});

export default CompetitionOptionsList;
