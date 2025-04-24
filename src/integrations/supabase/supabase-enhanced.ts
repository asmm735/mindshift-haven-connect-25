
import { supabase } from './client';
import { typedFrom } from '@/types/supabase-custom';

// This is a wrapper around the supabase client with custom typing
export const enhancedSupabase = {
  ...supabase,
  from: (table: string) => {
    // Type the response based on the table name
    switch (table) {
      case 'chat_messages':
        return supabase.from(typedFrom.chat_messages());
      case 'mood_entries':
        return supabase.from(typedFrom.mood_entries());
      case 'reviews':
        return supabase.from(typedFrom.reviews());
      case 'therapists':
        return supabase.from(typedFrom.therapists());
      case 'sound_therapy_tracks':
        return supabase.from(typedFrom.sound_therapy_tracks());
      default:
        return supabase.from(table);
    }
  }
};
