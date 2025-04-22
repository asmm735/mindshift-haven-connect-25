
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "MindShift's mood tracker has helped me identify patterns in my anxiety triggers. Being able to visualize my moods over time has been eye-opening.",
    name: "Jamie Lewis",
    role: "Teacher & Anxiety Warrior",
    avatar: "JL"
  },
  {
    quote: "The AI chatbot is there for me at 2am when I can't sleep and need someone to talk to. It's surprisingly comforting to have that support available 24/7.",
    name: "Chris Morgan",
    role: "Software Developer",
    avatar: "CM"
  },
  {
    quote: "Using the Pomodoro timer has transformed my workday. I'm more productive and the regular breaks have reduced my stress levels significantly.",
    name: "Alex Rivera",
    role: "Marketing Specialist",
    avatar: "AR"
  },
  {
    quote: "I found my current therapist through TheraConnect. The detailed profiles helped me find someone who specializes in exactly what I needed.",
    name: "Taylor Kim",
    role: "Graphic Designer",
    avatar: "TK"
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-mindshift-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-mindshift-raspberry mb-4">
            Transforming Mental Wellness Journeys
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stories from people whose lives have been positively impacted by MindShift.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="mindshift-card bg-white/90 border-0">
              <CardContent className="pt-6">
                <svg className="h-10 w-10 text-mindshift-lavender opacity-50 mb-4" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                
                <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 bg-mindshift-raspberry text-white">
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-mindshift-raspberry">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
