
import PageLayout from "@/components/layout/PageLayout";
import ReviewsSection from "@/components/features/Reviews/ReviewsSection";

const Reviews = () => {
  return (
    <PageLayout className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-mindshift-raspberry mb-2">User Reviews</h1>
        <p className="text-gray-600 mb-8">Read what our community has to say about their MindShift experience</p>
      
        <ReviewsSection />
      </div>
    </PageLayout>
  );
};

export default Reviews;
