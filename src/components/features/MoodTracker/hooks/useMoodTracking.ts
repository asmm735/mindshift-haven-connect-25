
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MoodEntry, MoodValue } from "@/types/supabase-custom";

export function useMoodTracking() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [moodPatterns, setMoodPatterns] = useState<{
    has_concerning_pattern: boolean;
    days_without_entry: number;
    negative_mood_count: number;
  } | null>(null);
  const { toast } = useToast();

  const todayISO = format(new Date(), "yyyy-MM-dd");

  const fetchMoodHistory = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", userId)
      .order("entry_date", { ascending: true })
      .limit(14);

    if (error) {
      toast({ title: "Failed to load mood history", variant: "destructive" });
    } else if (data) {
      const typedData = data.map(entry => ({
        ...entry,
        mood: entry.mood as MoodValue
      }));
      setMoodHistory(typedData);
    }
    setLoading(false);
  };

  const checkMoodPatterns = async (userId: string) => {
    const { data, error } = await supabase.rpc('check_mood_patterns', {
      user_id_param: userId
    });

    if (!error && data && data.length > 0) {
      setMoodPatterns(data[0]);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        fetchMoodHistory(session.user.id);
      } else {
        setLoading(false);
      }
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchMoodHistory(session.user.id);
      } else {
        setUserId(null);
        setMoodHistory([]);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userId) {
      checkMoodPatterns(userId);
    }
  }, [userId, moodHistory]);

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({ title: "Please select a mood", variant: "destructive" });
      return;
    }
    if (!userId) {
      toast({ title: "You must be signed in to log your mood", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    const moodValue = parseInt(selectedMood) as MoodValue;
    const todayEntry = moodHistory.find(entry => entry.entry_date === todayISO);

    if (todayEntry) {
      const { error } = await supabase
        .from('mood_entries')
        .update({ mood: moodValue, notes })
        .eq('user_id', userId)
        .eq('entry_date', todayISO);
      setIsSubmitting(false);

      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Mood updated!" });
        fetchMoodHistory(userId);
      }
    } else {
      const { error } = await supabase.from('mood_entries').insert({
        mood: moodValue,
        notes,
        entry_date: todayISO,
        user_id: userId
      });
      setIsSubmitting(false);

      if (error) {
        toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Mood logged successfully", description: "Your mood has been recorded for today." });
        fetchMoodHistory(userId);
      }
    }
  };

  return {
    selectedMood,
    setSelectedMood,
    notes,
    setNotes,
    moodHistory,
    isSubmitting,
    loading,
    userId,
    moodPatterns,
    todayISO,
    handleSubmit
  };
}
