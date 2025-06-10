import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import GoogleFit, { Scopes } from "react-native-google-fit";
import { t } from "@/src/service/translateService";

interface FitnessData {
  steps: number;
  calories: number;
  distance: number;
}

const FitnessData: React.FC = () => {
  const [fitnessData, setFitnessData] = useState<FitnessData>({
    steps: 0,
    calories: 0,
    distance: 0,
  });
  const [isAuthorized, setIsAuthorized] = useState(false);

  const requestActivityRecognitionPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
          {
            title: "Uprawnienie do śledzenia aktywności",
            message:
              "Aplikacja potrzebuje dostępu do śledzenia Twojej aktywności fizycznej",
            buttonNeutral: "Zapytaj później",
            buttonNegative: "Anuluj",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const authorizeGoogleFit = async () => {
    try {
      console.log("Starting Google Fit authorization...");

      // Request activity recognition permission first
      const hasPermission = await requestActivityRecognitionPermission();
      if (!hasPermission) {
        console.log("Activity recognition permission not granted");
        return;
      }

      // First check if Google Fit is available
      GoogleFit.isAvailable((isError, isAvailable) => {
        if (!isAvailable) {
          console.log("Google Fit is not available on this device");
          return;
        }
      });

      const authResult = await GoogleFit.authorize({
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_LOCATION_READ,
        ],
      });

      console.log("Authorization result:", authResult);

      if (authResult.success) {
        console.log("Google Fit authorization successful");
        setIsAuthorized(true);
        fetchFitnessData();
      } else {
        console.warn("Google Fit authorization failed:", authResult);
        setIsAuthorized(false);
      }
    } catch (error: any) {
      console.error("Google Fit authorization error details:", {
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
      });

      if (
        error?.message?.includes("verification") ||
        error?.message?.includes("weryfikacji")
      ) {
        console.log(
          "Verification error detected - Please add your email as a test user in Google Cloud Console"
        );
        setIsAuthorized(false);
      } else if (error?.message?.includes("NOBRIDGE")) {
        console.log(
          "Bridge error detected - Please ensure Google Fit is installed and running"
        );
        GoogleFit.isAvailable((isError, isAvailable) => {
          console.log("Google Fit available:", isAvailable, "Error:", isError);
          setIsAuthorized(false);
        });
      }
    }
  };

  const fetchFitnessData = async () => {
    try {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
      );

      const options = {
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
      };

      const stepsData = await GoogleFit.getDailyStepCountSamples(options);
      const caloriesData = await GoogleFit.getDailyCalorieSamples(options);
      const distanceData = await GoogleFit.getDailyDistanceSamples(options);

      const steps =
        stepsData?.find(
          (item) => item.source === "com.google.android.gms:estimated_steps"
        )?.steps[0]?.value || 0;

      const totalCalories = caloriesData.reduce(
        (acc, item) => acc + (item.calorie || 0),
        0
      );

      const totalDistance = distanceData.reduce(
        (acc, item) => acc + (item.distance || 0),
        0
      ); // in meters

      setFitnessData({
        steps,
        calories: totalCalories,
        distance: totalDistance,
      });
    } catch (error) {
      console.error("Error fetching fitness data:", error);
    }
  };

  useEffect(() => {
    authorizeGoogleFit();
  }, []);

  if (!isAuthorized) {
    return (
      <TouchableOpacity style={styles.container} onPress={authorizeGoogleFit}>
        <View style={styles.authorizeContainer}>
          <Ionicons
            name="fitness-outline"
            size={24}
            color={Colors.PrimaryGray}
          />
          <ThemedText style={styles.authorizeText}>
            {t("connect_google_fit")}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="fitness-outline" size={24} color={Colors.PrimaryGray} />
        <ThemedText style={styles.title}>{t("fitness_data")}</ThemedText>
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.dataItem}>
          <ThemedText style={styles.dataValue}>{fitnessData.steps}</ThemedText>
          <ThemedText style={styles.dataLabel}>{t("steps")}</ThemedText>
        </View>
        <View style={styles.dataItem}>
          <ThemedText style={styles.dataValue}>
            {Math.round(fitnessData.calories)}
          </ThemedText>
          <ThemedText style={styles.dataLabel}>{t("calories")}</ThemedText>
        </View>
        <View style={styles.dataItem}>
          <ThemedText style={styles.dataValue}>
            {Math.round(fitnessData.distance / 1000)}km
          </ThemedText>
          <ThemedText style={styles.dataLabel}>{t("distance")}</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: Colors.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PrimaryGray,
    marginLeft: 8,
  },
  dataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dataItem: {
    alignItems: "center",
    flex: 1,
  },
  dataValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.PrimaryGray,
  },
  dataLabel: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    marginTop: 4,
  },
  authorizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  authorizeText: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    marginLeft: 8,
  },
});

export default FitnessData;
