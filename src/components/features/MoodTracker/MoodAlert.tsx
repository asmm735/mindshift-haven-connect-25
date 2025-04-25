
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Frown, AlertCircle } from "lucide-react";

interface MoodAlertProps {
  daysWithoutEntry: number;
  negativeCount: number;
}

const MoodAlert = ({ daysWithoutEntry, negativeCount }: MoodAlertProps) => {
  const getMessage = () => {
    if (daysWithoutEntry > 0) {
      return `We noticed you haven't logged your mood for ${daysWithoutEntry} days. Taking a moment to reflect can help you stay mindful of your emotional well-being.`;
    }
    return "We noticed you've been experiencing some challenging emotions lately. Remember, it's okay to seek support when you need it.";
  };

  return (
    <Alert className="mb-6 bg-mindshift-light border-mindshift-lavender">
      <AlertCircle className="h-4 w-4 text-mindshift-raspberry" />
      <AlertDescription className="flex flex-col gap-4">
        <p className="text-gray-700">{getMessage()}</p>
        <div className="flex gap-4 flex-wrap">
          <Button asChild variant="outline" className="text-mindshift-raspberry border-mindshift-raspberry hover:bg-mindshift-raspberry/10">
            <Link to="/ai-chat">Chat with AI Assistant</Link>
          </Button>
          <Button asChild variant="outline" className="text-mindshift-raspberry border-mindshift-raspberry hover:bg-mindshift-raspberry/10">
            <Link to="/therapists">Connect with a Therapist</Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default MoodAlert;
