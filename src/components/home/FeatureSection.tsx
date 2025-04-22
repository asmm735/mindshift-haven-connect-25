
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Mood Tracker",
    description: "Track your emotional wellbeing over time and identify patterns that affect your mental health.",
    icon: "📊",
    link: "/mood-tracker",
    color: "from-pink-500 to-purple-600",
  },
  {
    title: "AI Chat Support",
    description: "Connect with our AI assistant anytime for immediate emotional support and guidance.",
    icon: "💬",
    link: "/ai-chat",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Pomodoro Timer",
    description: "Boost productivity and reduce stress with timed focus sessions and mindful breaks.",
    icon: "⏱️",
    link: "/pomodoro",
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "TheraConnect",
    description: "Find and connect with certified therapists in your area who specialize in your needs.",
    icon: "🔍",
    link: "/therapists",
    color: "from-emerald-500 to-teal-600",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-mindshift-raspberry mb-4">
            Features Designed for Your Wellbeing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tools and resources to help you monitor, maintain, and improve your mental health.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link to={feature.link} key={index} className="block h-full group">
              <Card className="mindshift-card h-full transform transition-all duration-300 group-hover:translate-y-[-5px]">
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white text-2xl mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-mindshift-raspberry">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">{feature.description}</CardDescription>
                  <div className="text-mindshift-raspberry font-medium flex items-center text-sm group-hover:underline">
                    <span>Explore</span>
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
