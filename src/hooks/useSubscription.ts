import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import { setShowSubscriptionModal, triggerRefresh } from "@/src/store/subscriptionSlice";
import { checkSubscriptionStatus, startSubscription, startTrial } from "@/src/service/apiService";

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
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector((state: RootState) => state.user.userId);
  const showSubscriptionModal = useSelector((state: RootState) => state.subscription.showSubscriptionModal);
  const refreshTrigger = useSelector((state: RootState) => state.subscription.refreshTrigger);
  const dispatch = useDispatch();

  const checkStatus = async () => {
    if (!userId) {
      setIsLoading(false);
      setIsSubscribed(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await checkSubscriptionStatus(userId);

      if (!data) {
        setIsSubscribed(false);
        return;
      }

      const now = new Date();
      const isActive = data.status === 'active' && new Date(data.end_date) > now;
      const isInTrial = data.status === 'trial' && data.trial_end_date ? new Date(data.trial_end_date) > now : false;
      
      setIsSubscribed(isActive || isInTrial);
    } catch (error) {
      console.error("Error checking subscription status:", error);
      setIsSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [userId, refreshTrigger]);

  const handleSubscribe = async (type: "monthly" | "yearly") => {
    if (!userId) {
      console.error("Cannot subscribe: No user ID");
      return false;
    }

    try {
      await startSubscription(userId, type);
      dispatch(setShowSubscriptionModal(false));
      dispatch(triggerRefresh());
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
      await startTrial(userId);
      dispatch(setShowSubscriptionModal(false));
      dispatch(triggerRefresh());
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
    setShowSubscriptionModal: (show: boolean) => dispatch(setShowSubscriptionModal(show)),
    subscribe: handleSubscribe,
    startTrial: handleStartTrial,
    getSubscriptionLimits,
    checkFeatureAccess,
  };
}; 