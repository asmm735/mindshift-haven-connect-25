
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CallToAction from "@/components/home/CallToAction";
import ReviewsSection from "@/components/features/Reviews/ReviewsSection";

const MindshiftStory = () => (
  <section className="bg-mindshift-lavender/90 py-12 px-4 md:px-0">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-mindshift-raspberry mb-4 text-center">The Story of MindShift</h2>
      <p className="text-gray-800 text-lg leading-relaxed text-center">
        We are three students — Jalaja Yelve, Asmita Pal, and Chaitrali Mithbawkar — from Vidyalankar Institute of Technology, brought together by a shared vision: to create a safe, welcoming space where people can truly acknowledge and nurture their mental well-being.
        <br /><br />
        In a world where 3 out of 5 people silently struggle with mental health, the pressure to "just keep going" is overwhelming, especially for students. The expectations, deadlines, comparison, and constant push to perform — all while trying to figure out life — can feel like too much. Yet, no one really teaches us how to cope, to pause, or even to breathe.
        <br /><br />
        MindShift was born from that very need — a space that doesn’t just help you track your moods or set timers, but one that gently reminds you: you are not alone. Whether it’s through our dynamic chatbot, our therapist-connect feature, or calming tools like Pomodoro sessions paired with soothing sounds — every part of this app is a reflection of empathy, care, and understanding.
        <br /><br />
        We built this not as developers, but as fellow students who’ve felt the weight of it all — and want you to know that your feelings are valid, your story matters, and there’s always a way forward
      </p>
    </div>
  </section>
);

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <MindshiftStory />
      <FeatureSection />
      <ReviewsSection />
      <TestimonialSection />
      <CallToAction />
    </PageLayout>
  );
};

export default Index;

