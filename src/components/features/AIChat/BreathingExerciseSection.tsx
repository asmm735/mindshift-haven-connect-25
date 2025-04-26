
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PauseIcon } from "lucide-react";

export type BreathingExercise = {
  name: string;
  instructions: string;
  duration: number;
  steps: string[];
  stepDurations: number[];
};

interface BreathingExerciseSectionProps {
  breathingExercises: BreathingExercise[];
  isBreathing: boolean;
  currentBreathingExercise: BreathingExercise | null;
  breathingStep: number;
  onStartExercise: (index: number) => void;
  onStopExercise: () => void;
}

const BreathingExerciseSection = ({
  breathingExercises,
  isBreathing,
  currentBreathingExercise,
  breathingStep,
  onStartExercise,
  onStopExercise
}: BreathingExerciseSectionProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {breathingExercises.map((exercise, index) => (
          <Card key={index} className="border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{exercise.name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-600">{exercise.instructions}</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => onStartExercise(index)}
                disabled={isBreathing}
                className="w-full"
              >
                Start Exercise
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {isBreathing && currentBreathingExercise && (
        <div className="mt-8 p-6 bg-mindshift-light rounded-xl text-center">
          <h3 className="text-xl font-medium text-mindshift-dark mb-4">{currentBreathingExercise.name}</h3>
          <div className="text-4xl font-bold text-mindshift-raspberry my-6 h-12 animate-pulse duration-1000">
            {currentBreathingExercise.steps[breathingStep]}
          </div>
          <Button 
            variant="outline" 
            size="lg" 
            className="mt-4" 
            onClick={onStopExercise}
          >
            <PauseIcon className="h-5 w-5 mr-2" /> Stop Exercise
          </Button>
        </div>
      )}
    </div>
  );
};

export default BreathingExerciseSection;
