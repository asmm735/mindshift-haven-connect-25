// Update the Therapist type to include new fields
export type Therapist = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  verified: boolean | null;
  phone_number: string | null;
  email: string | null;
};

// Add ChatMessage type for AIChat component
export type ChatMessage = {
  id: string;
  content: string;
  type: string;
  user_id: string;
  timestamp: string;
  metadata: any | null;
};

// Add additional type for the Mood value with new options
export type MoodValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Update MoodEntry type to use the new MoodValue type
export type MoodEntry = {
  id: string;
  mood: MoodValue;
  notes: string | null;
  entry_date: string;
  user_id: string;
  created_at: string | null;
};

// Add Review type for ReviewsSection component
export type Review = {
  id: string;
  content: string;
  rating: number | null;
  user_id: string;
  created_at: string | null;
};

// Add SoundTherapyTrack type for SoundSelector component
export type SoundTherapyTrack = {
  id: string;
  title: string;
  audio_url: string | null;
  category: string;
  description: string | null;
  duration: number | null;
  created_at: string | null;
};

// Add typedTables for consistency with imports
export const typedTables = {
  chat_messages: {} as ChatMessage,
  mood_entries: {} as MoodEntry,
  reviews: {} as Review,
  therapists: {} as Therapist,
  sound_therapy_tracks: {} as SoundTherapyTrack
};
