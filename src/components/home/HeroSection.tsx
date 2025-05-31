
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/37fe14e0-1b4e-4f77-9374-3d7961f886fd.png")',
          backgroundPosition: 'center'
        }}>
      </div>
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-white drop-shadow-md mb-4">
            Your Journey to <span className="text-mindshift-raspberry">Mental Wellbeing</span> Starts Here
          </h1>
          
          <p className="text-lg md:text-xl text-white drop-shadow mb-8">
            MindShift provides the tools and support you need to manage your mental health journey with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="mindshift-button" size="lg">
              <Link to="/mood-tracker">
                Track Your Mood
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/80 border-mindshift-raspberry text-mindshift-raspberry hover:bg-white">
              <Link to="/ai-chat">
                Chat with AI Assistant
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Story Section - Seamlessly integrated */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
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
      </div>
    </section>
  );
};

export default HeroSection;
