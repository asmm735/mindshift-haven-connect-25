
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80")',
          backgroundPosition: 'center',
          opacity: 0.8
        }}>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-mindshift-lavender/40 to-white"></div>
      
      {/* Content */}
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
    </section>
  );
};

export default HeroSection;
