
import { Json } from '@/integrations/supabase/types';

// Custom type definitions for our Supabase tables
export type ChatMessage = {
  id: string;
  user_id: string;
  type: string;
  content: string;
  timestamp: string;
  metadata: Json | null;
};

export type MoodEntry = {
  id: string;
  user_id: string;
  mood: number;
  notes: string | null;
  entry_date: string;
  created_at: string | null;
};

export type Review = {
  id: string;
  user_id: string;
  content: string;
  rating: number | null;
  created_at: string | null;
};

export type Therapist = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  verified: boolean | null;
};

export type SoundTherapyTrack = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  audio_url: string;
  duration: number | null;
  created_at: string | null;
};

// Helper functions to type-cast Supabase responses
export const typedFrom = {
  chat_messages: () => 'chat_messages' as unknown as ChatMessage,
  mood_entries: () => 'mood_entries' as unknown as MoodEntry,
  reviews: () => 'reviews' as unknown as Review,
  therapists: () => 'therapists' as unknown as Therapist,
  sound_therapy_tracks: () => 'sound_therapy_tracks' as unknown as SoundTherapyTrack,
};
