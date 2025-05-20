import { useState, useEffect } from 'react';
import { fetchCompletedChallenges, skipAfterPhoto } from '@/src/service/apiService';
import type { CompletedChallenge } from '@/src/service/apiService';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/src/store/habitsSlice';

export const useCompletedChallenges = () => {
  const [completedChallenges, setCompletedChallenges] = useState<CompletedChallenge[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const loadCompletedChallenges = async () => {
    try {
      const data = await fetchCompletedChallenges();
      if (data) {
        setCompletedChallenges(data);
      }
    } catch (error) {
      console.error('Error fetching completed challenges:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSkipAfterPhoto = async (challengeId: string) => {
    try {
      await skipAfterPhoto(challengeId);
      await loadCompletedChallenges();
    } catch (error) {
      console.error('Error skipping after photo:', error);
      throw error;
    }
  };

  const refresh = () => {
    setRefreshing(true);
    loadCompletedChallenges();
  };

  useEffect(() => {
    loadCompletedChallenges();
  }, []);

  return {
    completedChallenges,
    refreshing,
    refresh,
    skipAfterPhoto: handleSkipAfterPhoto,
  };
}; 