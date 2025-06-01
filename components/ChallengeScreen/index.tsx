import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useTranslation } from "react-i18next";
import { supabase } from "@/service/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ChallengeCard } from "./ChallengeCard";
import { ChallengeInvitationCard } from "./ChallengeInvitationCard";
import { ChallengeStats } from "./ChallengeStats";
import { LoadingScreen } from "@/components/LoadingScreen";

export const ChallengeScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const backgroundColor = useThemeColor({}, "background");

  const fetchData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Pobierz wyzwania
      const { data: challengesData, error: challengesError } = await supabase
        .from("challenges")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (challengesError) throw challengesError;
      setChallenges(challengesData || []);

      // Pobierz zaproszenia
      const { data: invitationsData, error: invitationsError } = await supabase
        .from("challenge_invitations")
        .select(
          `
          *,
          challenges:challenge_id (*),
          sender:sender_id (display_name)
        `
        )
        .eq("receiver_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (invitationsError) throw invitationsError;
      setInvitations(invitationsData || []);

      // Pobierz statystyki
      const { data: statsData, error: statsError } = await supabase
        .from("challenge_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (statsError && statsError.code !== "PGRST116") throw statsError;
      setStats(
        statsData || {
          total_challenges: 0,
          completed_challenges: 0,
          current_streak: 0,
          longest_streak: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching challenge data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <ThemedText style={styles.title}>{t("challenges")}</ThemedText>

        <ChallengeStats stats={stats} />

        {invitations.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {t("challenge_invitations")}
            </ThemedText>
            {invitations.map((invitation) => (
              <ChallengeInvitationCard
                key={invitation.id}
                invitation={invitation}
                onAccept={() => fetchData()}
                onDecline={() => fetchData()}
              />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {t("my_challenges")}
          </ThemedText>
          {challenges.length === 0 ? (
            <ThemedText style={styles.emptyText}>
              {t("no_challenges")}
            </ThemedText>
          ) : (
            challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onUpdate={() => fetchData()}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.7,
    marginTop: 16,
  },
});
