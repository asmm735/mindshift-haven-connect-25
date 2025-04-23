
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CallToAction from "@/components/home/CallToAction";
import ReviewsSection from "@/components/features/Reviews/ReviewsSection";

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <FeatureSection />
      <ReviewsSection />
      <TestimonialSection />
      <CallToAction />
    </PageLayout>
  );
};

export default Index;
