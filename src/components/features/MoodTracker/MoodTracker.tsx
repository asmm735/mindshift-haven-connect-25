
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarIcon, TrendingDown, MessageCircle, Phone } from "lucide-react";
import MoodAlert from "./MoodAlert";
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
    hasDeclineAlert,
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
          <CardDescription>View your mood trends over time</CardDescription>
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
          
          {hasDeclineAlert && moodHistory.length >= 5 && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="space-y-3">
                  <p>We noticed your mood has been declining significantly. Your mental health matters, and you don't have to face this alone.</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild size="sm" className="bg-mindshift-raspberry hover:bg-mindshift-raspberry/90">
                      <Link to="/ai-chat" className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Chat with our AI Assistant
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                      <a href="tel:988" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Crisis Hotline: 988
                      </a>
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
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
