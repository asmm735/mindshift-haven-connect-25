
import { supabase } from './client';

// This is a wrapper around the supabase client with custom typing
export const enhancedSupabase = {
  ...supabase,
  from: (table: string) => {
    // Type the response based on the table name
    switch (table) {
      case 'chat_messages':
        return supabase.from('chat_messages');
      case 'mood_entries':
        return supabase.from('mood_entries');
      case 'reviews':
        return supabase.from('reviews');
      case 'therapists':
        return supabase.from('therapists');
      case 'sound_therapy_tracks':
        return supabase.from('sound_therapy_tracks');
      default:
        return supabase.from(table);
    }
  }
};
