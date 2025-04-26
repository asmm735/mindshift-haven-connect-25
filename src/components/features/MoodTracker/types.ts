
import { MoodValue } from "@/types/supabase-custom";

export type MoodOption = {
  label: string;
  value: MoodValue;
  color: string;
  icon: JSX.Element;
};

export type MoodEntryChartData = {
  name: string;
  mood: number;
  notes: string | null;
  moodLabel: string;
};
