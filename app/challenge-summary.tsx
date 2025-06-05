import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ChallengeHeader } from "@/components/ChallengeSummary/ChallengeHeader";
import { ChallengeDates } from "@/components/ChallengeSummary/ChallengeDates";
import { ChallengeStats } from "@/components/ChallengeSummary/ChallengeStats";
import { ChallengeHabits } from "@/components/ChallengeSummary/ChallengeHabits";
import { ChallengeCompletionCalendar } from "@/components/ChallengeSummary/ChallengeCompletionCalendar";
import { t } from "@/src/service/translateService";
import { HabitData } from "@/components/AddHabitModal/types";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { ThemedText } from "@/components/Commons/ThemedText";
import {
  fetchChallengeById,
  getSignedUrl,
  deletePhoto,
  uploadBeforePhoto,
} from "@/src/service/apiService";
import Loading from "@/components/Commons/Loading";
import { Ionicons } from "@expo/vector-icons";
import DeletePhotoModal from "@/components/modals/DeletePhotoModal";
import * as ImagePicker from "expo-image-picker";
import PhotoPicker from "@/components/Commons/PhotoPicker";
import Carousel from "react-native-reanimated-carousel";
import PageIndicator from "@/components/Commons/PageIndicator";
import EmptyHabitsList from "@/components/HomeScreen/EmptyHabitsList";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PAGE_WIDTH = SCREEN_WIDTH - 40;

type PhotoType = "before" | "after";

interface PhotoItem {
  type: PhotoType;
  uri: string | null;
  photoUri: string | null;
}

export default function ChallengeSummaryScreen() {
  const { challengeId } = useLocalSearchParams();
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletePhotoModalVisible, setIsDeletePhotoModalVisible] =
    useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<PhotoType | null>(null);
  const [beforePhotoUrl, setBeforePhotoUrl] = useState<string | null>(null);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string | null>(null);
  const habits: HabitData[] = useSelector(
    (state: RootState) => state.habits.habits
  );
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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

  const handleDeletePhoto = async (photoType: PhotoType) => {
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

  const handlePickImage = async (type: PhotoType) => {
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
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Loading />
      </ScreenWrapper>
    );
  }

  const challengeHabits = habits.filter((habit) => {
    return challenge?.habits?.includes(habit.id) && habit.status === "active";
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

  const photoItems: PhotoItem[] = [
    {
      type: "before",
      uri: beforePhotoUrl,
      photoUri: challenge?.beforePhotoUri || null,
    },
    {
      type: "after",
      uri: afterPhotoUrl,
      photoUri: challenge?.afterPhotoUri || null,
    },
  ];

  return (
    <ScreenWrapper>
      <ScreenHeader
        title={t("challenge_summary")}
        onBack={() => router.push("/challenges")}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <ChallengeHeader title={challenge?.name || ""} />

        <ChallengeDates startDate={startDate} endDate={endDate} />

        {challengeHabits.length > 0 ? (
          <>
            <ChallengeStats
              totalDays={totalDays}
              totalCompletions={totalCompletions}
              completionRate={completionRate}
            />

            <ThemedText style={styles.sectionTitle} bold>
              {t("completion_calendar")}
            </ThemedText>
            <ChallengeCompletionCalendar
              startDate={startDate}
              endDate={endDate}
              challengeId={challengeId as string}
              showLegend={false}
            />

            <ThemedText style={styles.sectionTitle} bold>
              {t("habits")}
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>
              {t("individual_habits_completion_rate")}
            </ThemedText>
            <ChallengeHabits
              habits={challengeHabits}
              startDate={startDate}
              endDate={endDate}
              totalDays={totalDays}
            />

            <ThemedText style={styles.sectionTitle} bold>
              {t("visual_progress")}
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>
              {t("photos_private_description")}
            </ThemedText>

            <View style={styles.photosContainer}>
              <View style={{ width: PAGE_WIDTH, alignSelf: "center" }}>
                <Carousel
                  loop={false}
                  width={PAGE_WIDTH}
                  height={360}
                  data={photoItems}
                  onSnapToItem={setCurrentPhotoIndex}
                  renderItem={({ item }) => (
                    <View style={styles.photoSection}>
                      <View style={styles.photoHeader}>
                        <ThemedText style={styles.photoTitle}>
                          {t(
                            item.type === "before"
                              ? "before_photo"
                              : "after_photo"
                          )}
                        </ThemedText>
                        {item.photoUri && (
                          <TouchableOpacity
                            onPress={() => handleDeletePhoto(item.type)}
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
                      <View style={styles.photoWrapper}>
                        {item.photoUri ? (
                          item.uri ? (
                            <Image
                              source={{ uri: item.uri }}
                              style={styles.photo}
                              resizeMode="cover"
                              onError={(error) => {
                                console.error(
                                  "Error loading photo:",
                                  error.nativeEvent
                                );
                              }}
                            />
                          ) : (
                            <View style={styles.loadingContainer}>
                              <Loading />
                            </View>
                          )
                        ) : (
                          <PhotoPicker
                            onPress={() => handlePickImage(item.type)}
                            height={300}
                            style={styles.photo}
                          />
                        )}
                      </View>
                    </View>
                  )}
                />
              </View>
              <PageIndicator
                count={2}
                currentIndex={currentPhotoIndex}
                isVisible={true}
                activeColor={Colors.HotPink}
                inactiveColor={Colors.LightGray}
              />
            </View>
          </>
        ) : (
          <View style={styles.emptyHabitsContainer}>
            <EmptyHabitsList
              imageWidth={250}
              textColor={Colors.PrimaryGray}
              title={t("no_habits_in_challenge")}
              description={t("no_habits_in_challenge_summary")}
            />
          </View>
        )}

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
    color: Colors.PrimaryGray,
    marginVertical: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    marginBottom: 10,
    opacity: 0.7,
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
    backgroundColor: Colors.White,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.HotPink,
  },
  photoSection: {
    width: "100%",
    paddingHorizontal: 8,
  },
  photoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  photoWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  photoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PrimaryGray,
  },
  photo: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  deleteButton: {
    marginBottom: 12,
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
  emptyHabitsContainer: {
    marginVertical: 20,
    backgroundColor: Colors.White,
    borderRadius: 12,
    padding: 16,
  },
});
