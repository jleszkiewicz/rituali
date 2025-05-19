import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { ChallengeData } from '@/src/types/challenge';

export const useChallenges = () => {
  const challenges = useSelector((state: RootState) => state.challenges.challenges);

  const getChallengeById = (id: string): ChallengeData | undefined => {
    return challenges.find((challenge) => challenge.id === id);
  };

  return {
    challenges,
    getChallengeById,
  };
}; 