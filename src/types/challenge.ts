export interface ChallengeData {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  habits: string[];
  before_photo_uri?: string;
  after_photo_uri?: string;
  participants: string[];
}

export interface CompletedChallenge {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  habits: string[];
  before_photo_uri?: string;
  after_photo_uri?: string;
  participants: string[];
  was_displayed: boolean;
}

export interface ChallengeInvitation {
  id: string;
  challenge_id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  challenge: Challenge;
  sender: {
    id: string;
    username: string;
    avatar_url?: string;
  };
} 