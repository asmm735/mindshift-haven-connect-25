
import PageLayout from "@/components/layout/PageLayout";
import MoodTrackerComponent from "@/components/features/MoodTracker/MoodTracker";

const MoodTracker = () => {
  return (
    <PageLayout className="container mx-auto px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-mindshift-raspberry mb-2">Mood Tracker</h1>
        <p className="text-gray-600 mb-8">Monitor and visualize your emotional well-being over time</p>
      
        <MoodTrackerComponent />
      </div>
    </PageLayout>
  );
};

export default MoodTracker;
