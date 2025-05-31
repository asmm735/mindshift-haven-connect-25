
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import CallToAction from "@/components/home/CallToAction";
import HomeReviewsSection from "@/components/features/Reviews/HomeReviewsSection";

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <FeatureSection />
      <HomeReviewsSection />
      <CallToAction />
    </PageLayout>
  );
};

export default Index;
