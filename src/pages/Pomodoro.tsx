
import PageLayout from "@/components/layout/PageLayout";
import PomodoroTimer from "@/components/features/Pomodoro/PomodoroTimer";

const Pomodoro = () => {
  return (
    <PageLayout className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-mindshift-raspberry mb-2">Pomodoro Timer</h1>
        <p className="text-gray-600 mb-8">Boost productivity and mental well-being with focused work sessions</p>
      
        <PomodoroTimer />
      </div>
    </PageLayout>
  );
};

export default Pomodoro;
