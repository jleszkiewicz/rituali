import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { supabase } from "@/src/service/supabaseClient";

interface SubscriptionLimits {
  maxFriends: number;
  maxChallenges: number;
  maxHabits: number;
  hasChallengeSummaries: boolean;
}

const FREE_TIER_LIMITS: SubscriptionLimits = {
  maxFriends: 5,
  maxChallenges: 1,
  maxHabits: 5,
  hasChallengeSummaries: false,
};

const PREMIUM_TIER_LIMITS: SubscriptionLimits = {
  maxFriends: Infinity,
  maxChallenges: Infinity,
  maxHabits: Infinity,
  hasChallengeSummaries: true,
};

export const useSubscription = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!userId) {
        setIsLoading(false);
        setIsSubscribed(false);
        setShowSubscriptionModal(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No subscription found
            setIsSubscribed(false);
            setShowSubscriptionModal(true);
          } else {
            console.error("Error checking subscription:", error);
            setIsSubscribed(false);
            setShowSubscriptionModal(true);
          }
        } else {
          const now = new Date();
          const isActive = data.status === 'active' && new Date(data.end_date) > now;
          const isInTrial = data.status === 'trial' && new Date(data.trial_end_date) > now;
          
          setIsSubscribed(isActive || isInTrial);
          
          if (!isActive && !isInTrial) {
            setShowSubscriptionModal(true);
          }
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setIsSubscribed(false);
        setShowSubscriptionModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [userId]);

  const handleSubscribe = async (type: "monthly" | "yearly") => {
    if (!userId) {
      console.error("Cannot subscribe: No user ID");
      return false;
    }

    try {
      const now = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (type === 'yearly' ? 12 : 1));

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          status: 'active',
          plan_type: type,
          start_date: now.toISOString(),
          end_date: endDate.toISOString(),
          updated_at: now.toISOString()
        });

      if (error) throw error;

      setIsSubscribed(true);
      setShowSubscriptionModal(false);
      return true;
    } catch (error) {
      console.error("Error subscribing:", error);
      return false;
    }
  };

  const handleStartTrial = async () => {
    if (!userId) {
      console.error("Cannot start trial: No user ID");
      return false;
    }

    try {
      const now = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          status: 'trial',
          plan_type: 'monthly',
          start_date: now.toISOString(),
          end_date: trialEndDate.toISOString(),
          trial_end_date: trialEndDate.toISOString(),
          updated_at: now.toISOString()
        });

      if (error) throw error;

      setIsSubscribed(true);
      setShowSubscriptionModal(false);
      return true;
    } catch (error) {
      console.error("Error starting trial:", error);
      return false;
    }
  };

  const getSubscriptionLimits = (): SubscriptionLimits => {
    return isSubscribed ? PREMIUM_TIER_LIMITS : FREE_TIER_LIMITS;
  };

  const checkFeatureAccess = (
    feature: keyof SubscriptionLimits,
    currentCount: number
  ): boolean => {
    const limits = getSubscriptionLimits();
    const limit = limits[feature];
    return typeof limit === 'number' ? currentCount < limit : true;
  };

  return {
    isSubscribed,
    isLoading,
    showSubscriptionModal,
    setShowSubscriptionModal,
    subscribe: handleSubscribe,
    startTrial: handleStartTrial,
    getSubscriptionLimits,
    checkFeatureAccess,
  };
}; 