
import { supabase } from './client';
import type { Database } from './types';

// Define the allowed table names as a type
type TableNames = 'chat_messages' | 'mood_entries' | 'reviews' | 'therapists' | 'sound_therapy_tracks';

// This is a wrapper around the supabase client with custom typing
export const enhancedSupabase = {
  ...supabase,
  from: (table: TableNames) => {
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
        // This type assertion is safe because we've limited table to TableNames
        return supabase.from(table as TableNames);
    }
  }
};

