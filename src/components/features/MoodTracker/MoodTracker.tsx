import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Smile, Meh, Frown, Calendar } from "lucide-react";

const moodOptions = [
  { label: "Very Happy", value: 5, color: "#4ADE80", icon: <Smile className="w-6 h-6" /> },
  { label: "Happy", value: 4, color: "#A3E635", icon: <Smile className="w-6 h-6" /> },
  { label: "Neutral", value: 3, color: "#FBBF24", icon: <Meh className="w-6 h-6" /> },
  { label: "Sad", value: 2, color: "#FB923C", icon: <Meh className="w-6 h-6" /> },
  { label: "Very Sad", value: 1, color: "#F87171", icon: <Frown className="w-6 h-6" /> },
];

type MoodEntry = {
  id: string;
  mood: number;
  notes: string | null;
  entry_date: string; // YYYY-MM-DD
};

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const todayISO = format(new Date(), "yyyy-MM-dd");
  const todayEntry = moodHistory.find(entry => entry.entry_date === todayISO);

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
      setMoodHistory(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (todayEntry) {
      setSelectedMood(todayEntry.mood.toString());
      setNotes(todayEntry.notes || "");
    } else {
      setSelectedMood("");
      setNotes("");
    }
  }, [userId, todayEntry?.mood, todayEntry?.notes]);

  const handleMoodSelect = (value: string) => setSelectedMood(value);
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value);

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

    if (todayEntry) {
      const { error } = await supabase
        .from('mood_entries')
        .update({ mood: parseInt(selectedMood), notes })
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
        mood: parseInt(selectedMood),
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

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const moodValue = payload[0].value;
      const moodLabel = moodOptions.find(option => option.value === moodValue)?.label;
      const entryData = moodHistory.find(entry => format(new Date(entry.entry_date), "MMM dd") === label);
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{label}</p>
          <p className="text-mindshift-raspberry">{moodLabel}</p>
          {entryData?.notes && (
            <p className="text-sm text-gray-600 mt-1 max-w-xs whitespace-normal break-words">
              {entryData.notes}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const chartData = moodHistory.map(item => ({
    name: format(new Date(item.entry_date), "MMM dd"),
    mood: item.mood,
    notes: item.notes,
    moodLabel: moodOptions.find(option => option.value === item.mood)?.label ?? "",
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {!loading && userId && (
        <Card className="mindshift-card">
          <CardHeader>
            <CardTitle className="text-2xl text-mindshift-raspberry">How are you feeling today?</CardTitle>
            <CardDescription>Track your mood to identify patterns and improve your well-being.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select your mood</label>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map(option => (
                  <button
                    key={option.value}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                      selectedMood === option.value.toString()
                        ? "border-mindshift-raspberry bg-mindshift-raspberry/10"
                        : "border-gray-200 hover:border-mindshift-lavender"
                    }`}
                    onClick={() => handleMoodSelect(option.value.toString())}
                  >
                    <div className="w-8 h-8 rounded-full mb-1 flex items-center justify-center" style={{ color: option.color }}>
                      {option.icon}
                    </div>
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
              {isSubmitting ? "Saving..." : (todayEntry ? "Update Mood" : "Log your mood")}
            </Button>
          </CardFooter>
        </Card>
      )}
      <Card className="mindshift-card md:col-span-2">
        <CardHeader>
          <CardTitle className="text-2xl text-mindshift-raspberry">Your Mood History</CardTitle>
          <CardDescription>View your mood trends over the past weeks</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">Loading...</div>
          ) : !userId ? (
            <div className="text-center text-gray-500 my-14">
              Please <a href="/login" className="text-mindshift-raspberry hover:underline">sign in</a> to see your mood history.
            </div>
          ) : chartData.length === 0 ? (
            <div className="text-center text-gray-500 my-14">No mood entries yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis 
                  domain={[1, 5]} 
                  ticks={[1, 2, 3, 4, 5]} 
                  stroke="#666"
                  tickFormatter={(value) => {
                    const mood = moodOptions.find(m => m.value === value);
                    return mood ? mood.label.split(" ")[0] : "";
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
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
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Alert className="bg-mindshift-light border-mindshift-lavender">
            <AlertDescription className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-mindshift-raspberry" />
              {todayEntry ? 
                "You've tracked your mood today. Come back tomorrow for another entry!" : 
                "Tracking your mood regularly helps you understand patterns and triggers in your emotional well-being."
              }
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MoodTracker;
