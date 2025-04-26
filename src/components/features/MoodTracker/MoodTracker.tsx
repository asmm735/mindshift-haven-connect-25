
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { MoodAlert } from "./MoodAlert";
import { MoodChart } from "./MoodChart";
import { MoodSelector } from "./MoodSelector";
import { useMoodTracking } from "./hooks/useMoodTracking";

const MoodTracker = () => {
  const {
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
  } = useMoodTracking();

  const todayEntry = moodHistory.find(entry => entry.entry_date === todayISO);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {!loading && userId && moodPatterns?.has_concerning_pattern && (
        <div className="md:col-span-2">
          <MoodAlert 
            daysWithoutEntry={moodPatterns.days_without_entry}
            negativeCount={moodPatterns.negative_mood_count}
          />
        </div>
      )}
      
      {!loading && userId && (
        <MoodSelector
          selectedMood={selectedMood}
          notes={notes}
          isSubmitting={isSubmitting}
          onMoodSelect={setSelectedMood}
          onNotesChange={setNotes}
          onSubmit={handleSubmit}
          todayEntry={!!todayEntry}
        />
      )}
      
      <Card className="mindshift-card">
        <CardHeader>
          <CardTitle className="text-2xl text-mindshift-raspberry">Your Mood History</CardTitle>
          <CardDescription>View your mood trends over the past weeks</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-80">Loading...</div>
          ) : !userId ? (
            <div className="text-center text-gray-500 my-14">
              Please <a href="/login" className="text-mindshift-raspberry hover:underline">sign in</a> to see your mood history.
            </div>
          ) : moodHistory.length === 0 ? (
            <div className="text-center text-gray-500 my-14">No mood entries yet.</div>
          ) : (
            <MoodChart moodHistory={moodHistory} />
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Alert className="bg-mindshift-light border-mindshift-lavender">
            <AlertDescription className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-mindshift-raspberry" />
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
