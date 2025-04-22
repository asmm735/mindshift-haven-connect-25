
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80")',
          backgroundPosition: 'center',
          opacity: 0.8
        }}>
      </div>
      <div className="absolute inset-0 mindshift-gradient opacity-80"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Begin Your Mental Wellness Journey Today
          </h2>
          <p className="text-xl mb-8">
            Take the first step toward a healthier mind with tools designed to support your unique journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-mindshift-raspberry hover:bg-white/90">
              <Link to="/mood-tracker">Start Tracking Your Mood</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/therapists">Find a Therapist</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
