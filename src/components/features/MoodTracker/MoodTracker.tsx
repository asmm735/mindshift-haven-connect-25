
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

// Mood options
const moodOptions = [
  { label: "Very Happy", value: 5, color: "#4ADE80" },
  { label: "Happy", value: 4, color: "#A3E635" },
  { label: "Neutral", value: 3, color: "#FBBF24" },
  { label: "Sad", value: 2, color: "#FB923C" },
  { label: "Very Sad", value: 1, color: "#F87171" },
];

// Mock saved mood data (would connect to Firebase in real implementation)
const initialMoodHistory = Array.from({ length: 7 }, (_, i) => ({
  date: format(subDays(new Date(), 6 - i), "MMM dd"),
  mood: Math.floor(Math.random() * 5) + 1,
  notes: "",
}));

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [moodHistory, setMoodHistory] = useState(initialMoodHistory);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleMoodSelect = (value: string) => {
    setSelectedMood(value);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to save to Firebase
    setTimeout(() => {
      const today = format(new Date(), "MMM dd");
      const moodValue = parseInt(selectedMood);

      // Update mood history (in a real app, this would come from Firebase)
      const updatedHistory = [...moodHistory];
      // If today already has an entry, update it
      const todayIndex = updatedHistory.findIndex(entry => entry.date === today);
      if (todayIndex !== -1) {
        updatedHistory[todayIndex] = { date: today, mood: moodValue, notes };
      } else {
        // Add new entry and remove oldest if we have more than 7 entries
        updatedHistory.push({ date: today, mood: moodValue, notes });
        if (updatedHistory.length > 7) {
          updatedHistory.shift();
        }
      }

      setMoodHistory(updatedHistory);
      setIsSubmitting(false);
      setSelectedMood("");
      setNotes("");

      toast({
        title: "Mood logged successfully",
        description: "Your mood has been recorded for today.",
      });
    }, 1000);
  };

  // Prepare chart data with mood labels for tooltips
  const chartData = moodHistory.map(item => ({
    ...item,
    moodLabel: moodOptions.find(option => option.value === item.mood)?.label || "Unknown",
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      <Card className="mindshift-card">
        <CardHeader>
          <CardTitle className="text-2xl text-mindshift-raspberry">How are you feeling today?</CardTitle>
          <CardDescription>
            Track your mood to identify patterns and improve your well-being
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select your mood</label>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    selectedMood === option.value.toString()
                      ? "border-mindshift-raspberry bg-mindshift-raspberry/10"
                      : "border-gray-200 hover:border-mindshift-lavender"
                  }`}
                  onClick={() => handleMoodSelect(option.value.toString())}
                >
                  <div 
                    className="w-6 h-6 rounded-full mb-1"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Add notes (optional)</label>
            <Textarea
              placeholder="How are you feeling? What happened today?"
              value={notes}
              onChange={handleNotesChange}
              className="resize-none h-32"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="w-full mindshift-button"
          >
            {isSubmitting ? "Logging mood..." : "Log your mood"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="mindshift-card">
        <CardHeader>
          <CardTitle className="text-2xl text-mindshift-raspberry">Your Mood History</CardTitle>
          <CardDescription>
            View your mood trends over the past week
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis 
                domain={[1, 5]} 
                ticks={[1, 2, 3, 4, 5]} 
                stroke="#666"
                tickFormatter={(value) => {
                  const mood = moodOptions.find(m => m.value === value);
                  return mood ? mood.label.split(" ")[0] : "";
                }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  const mood = moodOptions.find(m => m.value === value);
                  return [mood?.label || "Unknown", "Mood"];
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#943c64"
                strokeWidth={3}
                dot={{ stroke: "#943c64", strokeWidth: 2, r: 6, fill: "white" }}
                activeDot={{ stroke: "#943c64", strokeWidth: 2, r: 8, fill: "#943c64" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="justify-center">
          <Alert className="bg-mindshift-light border-mindshift-lavender">
            <AlertDescription>
              Tracking your mood regularly can help you understand patterns and triggers in your emotional well-being.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MoodTracker;
