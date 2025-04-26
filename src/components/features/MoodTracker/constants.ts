
import { Heart, Smile, Sun, CircleDot, Battery, Frown, Cloud, CloudRain, Zap, Skull } from "lucide-react";
import { MoodOption } from "./types";

export const moodOptions: MoodOption[] = [
  { label: "Excited", value: 10, color: "#22c55e", icon: <Heart className="w-6 h-6" /> },
  { label: "Happy", value: 9, color: "#4ade80", icon: <Smile className="w-6 h-6" /> },
  { label: "Calm", value: 8, color: "#60a5fa", icon: <Sun className="w-6 h-6" /> },
  { label: "Normal", value: 7, color: "#93c5fd", icon: <CircleDot className="w-6 h-6" /> },
  { label: "Exhausted", value: 6, color: "#fbbf24", icon: <Battery className="w-6 h-6" /> },
  { label: "Frustrated", value: 5, color: "#fb923c", icon: <Frown className="w-6 h-6" /> },
  { label: "Sad", value: 4, color: "#f87171", icon: <Cloud className="w-6 h-6" /> },
  { label: "Anxious", value: 3, color: "#ef4444", icon: <CloudRain className="w-6 h-6" /> },
  { label: "Stressed", value: 2, color: "#dc2626", icon: <Zap className="w-6 h-6" /> },
  { label: "Depressed", value: 1, color: "#991b1b", icon: <Skull className="w-6 h-6" /> },
];
