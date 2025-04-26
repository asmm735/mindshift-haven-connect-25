
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { moodOptions } from "./constants";

type MoodSelectorProps = {
  selectedMood: string;
  notes: string;
  isSubmitting: boolean;
  onMoodSelect: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
  todayEntry?: boolean;
};

export const MoodSelector = ({
  selectedMood,
  notes,
  isSubmitting,
  onMoodSelect,
  onNotesChange,
  onSubmit,
  todayEntry
}: MoodSelectorProps) => {
  return (
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
                onClick={() => onMoodSelect(option.value.toString())}
              >
                <div 
                  className="w-8 h-8 rounded-full mb-1 flex items-center justify-center" 
                  style={{ color: option.color }}
                >
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
            onChange={(e) => onNotesChange(e.target.value)}
            className="resize-none h-32"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full mindshift-button"
        >
          {isSubmitting ? "Saving..." : (todayEntry ? "Update Mood" : "Log your mood")}
        </Button>
      </CardFooter>
    </Card>
  );
};
