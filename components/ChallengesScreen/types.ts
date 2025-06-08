export interface Friend {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completion_percentage: number;
}

export interface Participant {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
} 