
import { supabase } from './client';

// The auto-generated types may not reflect the current database schema yet.
// This wrapper provides a typed interface for our known tables.
export const enhancedSupabase = {
  ...supabase,
  from: (table: string) => {
    return (supabase as any).from(table);
  }
};
