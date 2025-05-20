import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useChallenges } from "@/src/hooks/useChallenges";
import { ChallengeHeader } from "@/components/ChallengeSummary/ChallengeHeader";
import { ChallengeDates } from "@/components/ChallengeSummary/ChallengeDates";
import { ChallengeStats } from "@/components/ChallengeSummary/ChallengeStats";
import { ChallengeHabits } from "@/components/ChallengeSummary/ChallengeHabits";
import { t } from "@/src/service/translateService";
import { HabitData } from "@/components/AddHabitModal/types";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { ThemedText } from "@/components/Commons/ThemedText";
import AddAfterPhotoModal from "@/components/modals/AddAfterPhotoModal";
import {
  fetchChallengeById,
  getSignedUrl,
  deletePhoto,
  uploadBeforePhoto,
} from "@/src/service/apiService";
import type { Challenge } from "@/src/service/apiService";
import Loading from "@/components/Commons/Loading";
import { Ionicons } from "@expo/vector-icons";
import DeletePhotoModal from "@/components/modals/DeletePhotoModal";
import * as ImagePicker from "expo-image-picker";
import PhotoPicker from "@/components/Commons/PhotoPicker";

export default function ChallengeSummaryScreen() {
  const { challengeId } = useLocalSearchParams();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddAfterPhotoModalVisible, setIsAddAfterPhotoModalVisible] =
    useState(false);
  const [isDeletePhotoModalVisible, setIsDeletePhotoModalVisible] =
    useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<"before" | "after" | null>(
    null
  );
  const [beforePhotoUrl, setBeforePhotoUrl] = useState<string | null>(null);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string | null>(null);
  const habits: HabitData[] = useSelector(
    (state: RootState) => state.habits.habits
  );

  const refreshPhotoUrls = async () => {
    if (challenge?.beforePhotoUri) {
      const url = await getSignedUrl("before", challenge.beforePhotoUri);
      setBeforePhotoUrl(url);
    }
    if (challenge?.afterPhotoUri) {
      const url = await getSignedUrl("after", challenge.afterPhotoUri);
      setAfterPhotoUrl(url);
    }
  };

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const data = await fetchChallengeById(challengeId as string);
        setChallenge(data);
      } catch (error) {
        console.error("Error loading challenge:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [challengeId]);

  useEffect(() => {
    if (challenge) {
      refreshPhotoUrls();
      const interval = setInterval(refreshPhotoUrls, 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [challenge]);

  const handlePhotoAdded = async () => {
    setIsAddAfterPhotoModalVisible(false);
    try {
      const data = await fetchChallengeById(challengeId as string);
      if (data) {
        setChallenge(data);
      }
    } catch (error) {
      console.error("Error refreshing challenge:", error);
    }
  };

  const handleDeletePhoto = async (photoType: "before" | "after") => {
    if (!challenge) return;
    setPhotoToDelete(photoType);
    setIsDeletePhotoModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!challenge || !photoToDelete) return;

    try {
      await deletePhoto(challenge.id, photoToDelete);
      const updatedChallenge = await fetchChallengeById(challenge.id);
      setChallenge(updatedChallenge);
      if (photoToDelete === "before") {
        setBeforePhotoUrl(null);
      } else {
        setAfterPhotoUrl(null);
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    } finally {
      setIsDeletePhotoModalVisible(false);
      setPhotoToDelete(null);
    }
  };

  const handlePickImage = async (type: "before" | "after") => {
    if (!challenge) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === "before") {
          const publicUrl = await uploadBeforePhoto(
            challenge.id,
            result.assets[0].uri
          );
          setBeforePhotoUrl(publicUrl);
          const updatedChallenge = await fetchChallengeById(challenge.id);
          setChallenge(updatedChallenge);
        } else {
          setIsAddAfterPhotoModalVisible(true);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(t("error"), t("error_picking_image"));
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Loading />
      </ScreenWrapper>
    );
  }

  if (!challenge) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <ThemedText>Challenge not found</ThemedText>
        </View>
      </ScreenWrapper>
    );
  }

  const challengeHabits = habits.filter((habit) => {
    return challenge?.habits?.includes(habit.id);
  });

  const startDate = new Date(challenge?.startDate || "");
  const endDate = new Date(challenge?.endDate || "");
  const totalDays =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  const totalCompletions = challengeHabits.reduce(
    (total: number, habit: HabitData) => {
      return (
        total +
        (habit.completionDates?.filter((date: string) => {
          const completionDate = new Date(date);
          return completionDate >= startDate && completionDate <= endDate;
        }).length || 0)
      );
    },
    0
  );

  const completionRate = Math.round(
    (totalCompletions / (totalDays * challengeHabits.length)) * 100
  );

  return (
    <ScreenWrapper>
      <ScreenHeader
        title={t("challenge_summary")}
        onBack={() => router.back()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <ChallengeHeader title={challenge.name} />

        <ChallengeDates startDate={startDate} endDate={endDate} />

        <ChallengeStats
          totalDays={totalDays}
          totalCompletions={totalCompletions}
          completionRate={completionRate}
        />

        <ChallengeHabits
          habits={challengeHabits}
          startDate={startDate}
          endDate={endDate}
          totalDays={totalDays}
        />

        <View style={styles.photosContainer}>
          <View style={styles.photoSection}>
            <View style={styles.photoHeader}>
              <ThemedText style={styles.sectionTitle}>
                {t("before_photo")}
              </ThemedText>
              {challenge.beforePhotoUri && (
                <TouchableOpacity
                  onPress={() => handleDeletePhoto("before")}
                  style={styles.deleteButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={24}
                    color={Colors.HotPink}
                  />
                </TouchableOpacity>
              )}
            </View>
            {challenge.beforePhotoUri ? (
              beforePhotoUrl ? (
                <Image
                  source={{ uri: beforePhotoUrl }}
                  style={styles.photo}
                  resizeMode="cover"
                  onError={(error) => {
                    console.error(
                      "Error loading before photo:",
                      error.nativeEvent
                    );
                  }}
                />
              ) : (
                <View style={styles.loadingContainer}>
                  <Loading />
                  <ThemedText style={styles.loadingText}>
                    Loading before photo...
                  </ThemedText>
                </View>
              )
            ) : (
              <PhotoPicker
                onPress={() => handlePickImage("before")}
                height={300}
                style={styles.photo}
              />
            )}
          </View>

          <View style={styles.photoSection}>
            <View style={styles.photoHeader}>
              <ThemedText style={styles.sectionTitle}>
                {t("after_photo")}
              </ThemedText>
              {challenge.afterPhotoUri && (
                <TouchableOpacity
                  onPress={() => handleDeletePhoto("after")}
                  style={styles.deleteButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={24}
                    color={Colors.HotPink}
                  />
                </TouchableOpacity>
              )}
            </View>
            {challenge.afterPhotoUri ? (
              afterPhotoUrl ? (
                <Image
                  source={{ uri: afterPhotoUrl }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              ) : (
                <ThemedText>Loading after photo...</ThemedText>
              )
            ) : (
              <PhotoPicker
                onPress={() => handlePickImage("after")}
                height={300}
                style={styles.photo}
              />
            )}
          </View>
        </View>

        <AddAfterPhotoModal
          isVisible={isAddAfterPhotoModalVisible}
          onClose={() => setIsAddAfterPhotoModalVisible(false)}
          challengeId={challenge.id}
          onPhotoAdded={handlePhotoAdded}
        />

        <DeletePhotoModal
          isVisible={isDeletePhotoModalVisible}
          onClose={() => {
            setIsDeletePhotoModalVisible(false);
            setPhotoToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.PrimaryGray,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PrimaryGray,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    marginBottom: 16,
  },
  afterPhotoSection: {
    backgroundColor: Colors.White,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.PrimaryGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photosContainer: {
    marginBottom: 24,
  },
  photoSection: {
    marginBottom: 24,
    backgroundColor: Colors.White,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.PrimaryGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photo: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  addPhotoButton: {
    backgroundColor: Colors.HotPink,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "600",
  },
  photoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  deleteButton: {
    marginBottom: 12,
  },
  photoPicker: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    backgroundColor: Colors.White,
    borderWidth: 2,
    borderColor: Colors.PrimaryGray,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
  loadingContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: Colors.PrimaryGray,
  },
});
