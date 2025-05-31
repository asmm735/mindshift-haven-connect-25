
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CallToAction from "@/components/home/CallToAction";
import HomeReviewsSection from "@/components/features/Reviews/HomeReviewsSection";

const MindshiftStory = () => (
  <section className="relative py-12 px-4 md:px-0 overflow-hidden">
    {/* Background with same image as hero */}
    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/37fe14e0-1b4e-4f77-9374-3d7961f886fd.png")',
        backgroundPosition: 'center',
        opacity: 0.6
      }}>
    </div>
    <div className="absolute inset-0 bg-black/40"></div>
    
    <div className="max-w-3xl mx-auto relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center drop-shadow-lg">The Story of MindShift</h2>
      <p className="text-white text-lg leading-relaxed text-center drop-shadow-md">
        We are two students — Jalaja Yelve and Asmita Pal from Vidyalankar Institute of Technology, brought together by a shared vision: to create a safe, welcoming space where people can truly acknowledge and nurture their mental well-being.
        <br /><br />
        In a world where 3 out of 5 people silently struggle with mental health, the pressure to "just keep going" is overwhelming, especially for students. The expectations, deadlines, comparison, and constant push to perform — all while trying to figure out life — can feel like too much. Yet, no one really teaches us how to cope, to pause, or even to breathe.
        <br /><br />
        MindShift was born from that very need — a space that doesn't just help you track your moods or set timers, but one that gently reminds you: you are not alone. Whether it's through our dynamic chatbot, our therapist-connect feature, or calming tools like Pomodoro sessions paired with soothing sounds — every part of this app is a reflection of empathy, care, and understanding.
        <br /><br />
        We built this not as developers, but as fellow students who've felt the weight of it all — and want you to know that your feelings are valid, your story matters, and there's always a way forward.
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
      <HomeReviewsSection />
      <TestimonialSection />
      <CallToAction />
    </PageLayout>
  );
};

export default Index;
