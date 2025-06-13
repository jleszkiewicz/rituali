import GoogleFit, { Scopes } from "react-native-google-fit";
import { Platform, PermissionsAndroid, Linking } from "react-native";

export interface FitnessData {
  steps: number;
  calories: number;
  distance: number;
}

// Track if we've already shown the permission dialog
let hasShownPermissionDialog = false;
let lastPermissionRequestTime = 0;
const MIN_TIME_BETWEEN_REQUESTS = 5000; // 5 seconds

export const requestActivityRecognitionPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    try {
      // Check if we've shown the dialog recently
      const now = Date.now();
      if (hasShownPermissionDialog && now - lastPermissionRequestTime < MIN_TIME_BETWEEN_REQUESTS) {
        console.log("Permission dialog was shown recently, waiting...");
        return false;
      }

      // Check if permissions are already granted
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ];

      console.log("Checking current permission statuses...");
      // First check which permissions are already granted
      const permissionStatuses = await Promise.all(
        permissions.map(permission =>
          PermissionsAndroid.check(permission)
        )
      );

      console.log("Current permission statuses:", permissionStatuses);

      // If all permissions are granted, return true
      if (permissionStatuses.every(status => status)) {
        console.log("All permissions are already granted");
        return true;
      }

      // Only request permissions that aren't already granted
      const permissionsToRequest = permissions.filter(
        (_, index) => !permissionStatuses[index]
      );

      if (permissionsToRequest.length === 0) {
        console.log("All permissions are already granted");
        return true;
      }

      console.log("Requesting permissions:", permissionsToRequest);
      hasShownPermissionDialog = true;
      lastPermissionRequestTime = now;

      const results = await Promise.all(
        permissionsToRequest.map(permission =>
          PermissionsAndroid.request(permission, {
            title: "Uprawnienia do śledzenia aktywności",
            message: "Aplikacja potrzebuje dostępu do lokalizacji i śledzenia aktywności fizycznej",
            buttonNeutral: "Zapytaj później",
            buttonNegative: "Anuluj",
            buttonPositive: "OK",
          })
        )
      );

      console.log("Permission request results:", results);

      // Check if all requested permissions were granted
      const allGranted = results.every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        console.log("Not all permissions were granted");
        return false;
      }

      console.log("All permissions granted successfully");
      return true;
    } catch (err) {
      console.warn("Error requesting permissions:", err);
      return false;
    }
  }
  return true;
};

export const openGoogleFitApp = async (): Promise<void> => {
  try {
    console.log("Opening settings...");
    await Linking.openSettings();
  } catch (error) {
    console.error("Error opening settings:", error);
  }
};

export const authorizeGoogleFit = async (): Promise<boolean> => {
  try {
    console.log("Starting Google Fit authorization...");

    const hasPermission = await requestActivityRecognitionPermission();
    if (!hasPermission) {
      console.log("Activity recognition permission not granted");
      return false;
    }

    // First check if Google Fit is available
    return new Promise((resolve) => {
      GoogleFit.isAvailable((isError: boolean, isAvailable: boolean) => {
        console.log("Google Fit availability check:", { isError, isAvailable });
        
        if (!isAvailable) {
          console.log("Google Fit is not available on this device");
          resolve(false);
          return;
        }

        // Check if already authorized
        GoogleFit.isAuthorized()
          .then((isAuthorized: boolean) => {
            console.log("Current authorization status:", isAuthorized);
            if (isAuthorized) {
              console.log("Already authorized with Google Fit");
              resolve(true);
              return;
            }

            // If not authorized, proceed with authorization
            console.log("Starting Google Fit authorization process...");
            GoogleFit.authorize({
              scopes: [
                Scopes.FITNESS_ACTIVITY_READ,
                Scopes.FITNESS_BODY_READ,
                Scopes.FITNESS_LOCATION_READ,
              ],
            })
              .then((authResult) => {
                console.log("Authorization result:", authResult);
                resolve(authResult.success);
              })
              .catch((error: unknown) => {
                console.error("Google Fit authorization error:", error);
                resolve(false);
              });
          })
          .catch((error: unknown) => {
            console.error("Error checking authorization status:", error);
            resolve(false);
          });
      });
    });
  } catch (error: unknown) {
    console.error("Unexpected error in authorizeGoogleFit:", error);
    return false;
  }
};

export const fetchFitnessData = async (): Promise<FitnessData | null> => {
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

    console.log("Fetching fitness data for date range:", options);

    const stepsData = await GoogleFit.getDailyStepCountSamples(options);
    console.log("Steps data received:", JSON.stringify(stepsData, null, 2));

    const caloriesData = await GoogleFit.getDailyCalorieSamples(options);
    console.log("Calories data received:", JSON.stringify(caloriesData, null, 2));

    const distanceData = await GoogleFit.getDailyDistanceSamples(options);
    console.log("Distance data received:", JSON.stringify(distanceData, null, 2));

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

    const result = {
      steps,
      calories: totalCalories,
      distance: totalDistance,
    };

    console.log("Processed fitness data:", result);
    return result;
  } catch (error) {
    console.error("Error fetching fitness data:", error);
    return null;
  }
};

export const isGoogleFitAvailable = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    GoogleFit.isAvailable((isError, isAvailable) => {
      console.log("Google Fit availability check:", { isError, isAvailable });
      if (isError) {
        console.error("Error checking Google Fit availability:", isError);
        resolve(false);
      } else {
        resolve(isAvailable);
      }
    });
  });
}; 