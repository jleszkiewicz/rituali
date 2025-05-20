import { useState, useEffect } from 'react';
import { fetchCompletedChallenges, skipAfterPhoto } from '@/src/service/apiService';
import type { CompletedChallenge } from '@/src/service/apiService';

export const useCompletedChallenges = () => {
  const [completedChallenges, setCompletedChallenges] = useState<CompletedChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadCompletedChallenges = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching completed challenges...');
      const data = await fetchCompletedChallenges();
      console.log('Fetched completed challenges:', data);
      if (data) {
        setCompletedChallenges(data);
      }
    } catch (error) {
      console.error('Error fetching completed challenges:', error);
    } finally {
      setIsLoading(false);
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
    console.log('useCompletedChallenges hook mounted');
    loadCompletedChallenges();
  }, []);

  return {
    completedChallenges,
    isLoading,
    refreshing,
    refresh,
    skipAfterPhoto: handleSkipAfterPhoto,
  };
}; 