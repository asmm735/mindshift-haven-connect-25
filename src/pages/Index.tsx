
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <PageLayout>
      <div className="flex flex-col w-full">
        <HeroSection />
        <FeatureSection />
        <TestimonialSection />
        <CallToAction />
      </div>
    </PageLayout>
  );
};

export default Index;
