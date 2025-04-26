
import { Heart, Smile, Sun, CircleDot, Battery, Frown, Cloud, CloudRain, Zap, Skull } from "lucide-react";
import { MoodOption } from "./types";

export const moodOptions: MoodOption[] = [
  { label: "Excited", value: 10, color: "#22c55e", icon: Heart },
  { label: "Happy", value: 9, color: "#4ade80", icon: Smile },
  { label: "Calm", value: 8, color: "#60a5fa", icon: Sun },
  { label: "Normal", value: 7, color: "#93c5fd", icon: CircleDot },
  { label: "Exhausted", value: 6, color: "#fbbf24", icon: Battery },
  { label: "Frustrated", value: 5, color: "#fb923c", icon: Frown },
  { label: "Sad", value: 4, color: "#f87171", icon: Cloud },
  { label: "Anxious", value: 3, color: "#ef4444", icon: CloudRain },
  { label: "Stressed", value: 2, color: "#dc2626", icon: Zap },
  { label: "Depressed", value: 1, color: "#991b1b", icon: Skull },
];
