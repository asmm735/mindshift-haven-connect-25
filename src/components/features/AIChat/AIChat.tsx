
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendIcon, MicIcon, PauseIcon, TimerIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Enhanced AI responses with more emotionally intelligent content
const aiResponses = [
  "I hear you're going through a difficult time. How long have you been feeling this way?",
  "That sounds really challenging. Would it help to explore what might be triggering these feelings?",
  "I notice you mentioned feeling overwhelmed. Would you like to try a quick breathing exercise to help center yourself?",
  "It takes courage to share these feelings. What kind of support would feel most helpful right now?",
  "Sometimes when we're struggling, our thoughts can become quite critical. How would you respond to a friend sharing the same concerns?",
  "It sounds like things have been heavy lately. Would you like to try a breathing exercise or talk to someone?",
  "I'm hearing that you're experiencing a lot of pressure right now. What's one small thing you could do today to show yourself some compassion?",
  "Many people experience similar feelings. Would it be helpful to discuss some strategies that others have found useful?",
  "It's important to acknowledge these emotions. How have you been coping so far?",
  "Thank you for trusting me with this. Would you like to explore some resources that might help with what you're experiencing?"
];

// Breathing exercise instructions
const breathingExercises = [
  {
    name: "Box Breathing",
    instructions: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat.",
    duration: 16, // seconds for one cycle
    steps: ["Inhale...", "Hold...", "Exhale...", "Hold..."],
    stepDurations: [4, 4, 4, 4] // seconds per step
  },
  {
    name: "4-7-8 Breathing",
    instructions: "Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat.",
    duration: 19, // seconds for one cycle
    steps: ["Inhale...", "Hold...", "Exhale..."],
    stepDurations: [4, 7, 8] // seconds per step
  },
  {
    name: "Deep Breathing",
    instructions: "Inhale deeply for 5 seconds, exhale slowly for 5 seconds. Repeat.",
    duration: 10, // seconds for one cycle
    steps: ["Inhale deeply...", "Exhale slowly..."],
    stepDurations: [5, 5] // seconds per step
  }
];

// Types for messages
type MessageType = "user" | "ai";

interface Message {
  id: number;
  type: MessageType;
  text: string;
  timestamp: Date;
}

const AIChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      text: "Hello, I'm your MindShift assistant. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentBreathingExercise, setCurrentBreathingExercise] = useState<typeof breathingExercises[0] | null>(null);
  const [breathingStep, setBreathingStep] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from Supabase when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('user_id', session.session.user.id)
            .order('timestamp', { ascending: true });
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            const loadedMessages = data.map(msg => ({
              id: msg.id,
              type: msg.type as MessageType,
              text: msg.content,
              timestamp: new Date(msg.timestamp)
            }));
            setMessages(loadedMessages);
          }
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };
    
    loadChatHistory();
  }, []);

  // Save message to Supabase
  const saveMessage = async (message: Message) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;
      
      await supabase.from('chat_messages').insert({
        user_id: session.session.user.id,
        type: message.type,
        content: message.text,
        timestamp: message.timestamp.toISOString()
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const detectAnxietyOrDepression = (text: string): boolean => {
    const keywords = [
      'anxious', 'anxiety', 'worried', 'stress', 'stressed',
      'depressed', 'depression', 'sad', 'hopeless', 'overwhelmed',
      'exhausted', 'tired', 'can\'t sleep', 'insomnia', 'panic',
      'no energy', 'no motivation', 'worthless', 'suicidal', 
      'kill myself', 'end my life', 'don\'t want to live'
    ];
    
    return keywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const getEmpathicResponse = (): string => {
    const empathicResponses = [
      "It sounds like things have been difficult lately. Would you like to try a breathing exercise that might help?",
      "I'm hearing that you're going through some challenging emotions. Would talking to a professional help?",
      "That sounds really tough. Many people find breathing exercises helpful in moments like these. Would you like to try one?",
      "I'm sorry you're experiencing this. Would you like to explore some coping strategies together?",
      "It takes courage to share these feelings. Would a brief breathing exercise help right now?"
    ];
    
    return empathicResponses[Math.floor(Math.random() * empathicResponses.length)];
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    saveMessage(userMessage); // Save user message to Supabase
    setInput("");
    setIsTyping(true);

    // Check for anxiety or depression indicators
    const potentialMentalHealthIssue = detectAnxietyOrDepression(input.trim());

    // Simulate AI response after a delay
    setTimeout(() => {
      let aiResponse: string;
      
      if (potentialMentalHealthIssue) {
        aiResponse = getEmpathicResponse();
      } else if (input.toLowerCase().includes("breathing") || input.toLowerCase().includes("exercise")) {
        aiResponse = "Would you like to try a breathing exercise? I can guide you through box breathing, 4-7-8 breathing, or deep breathing.";
      } else {
        const randomIndex = Math.floor(Math.random() * aiResponses.length);
        aiResponse = aiResponses[randomIndex];
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        text: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      saveMessage(aiMessage); // Save AI message to Supabase
      setIsTyping(false);
    }, 1500);
  };

  const startBreathingExercise = (exerciseIndex: number) => {
    if (isBreathing) return;
    
    const exercise = breathingExercises[exerciseIndex];
    setCurrentBreathingExercise(exercise);
    setBreathingStep(0);
    setIsBreathing(true);
    
    let currentStep = 0;
    
    // Add a message about starting the exercise
    const aiMessage: Message = {
      id: messages.length + 1,
      type: "ai",
      text: `Let's begin the ${exercise.name}. ${exercise.instructions}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    saveMessage(aiMessage);
    
    breathingIntervalRef.current = setInterval(() => {
      setBreathingStep(currentStep % exercise.steps.length);
      currentStep++;
    }, 1000);
    
    // Stop after a few cycles (e.g., 3 cycles)
    setTimeout(() => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
        breathingIntervalRef.current = null;
      }
      setIsBreathing(false);
      
      // Add a message about completing the exercise
      const completionMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        text: "Great job with the breathing exercise! How do you feel now?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, completionMessage]);
      saveMessage(completionMessage);
      
    }, exercise.duration * 1000 * 3); // 3 cycles
  };

  const stopBreathingExercise = () => {
    if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current);
      breathingIntervalRef.current = null;
    }
    setIsBreathing(false);
    
    // Add a message about stopping the exercise
    const aiMessage: Message = {
      id: messages.length + 1,
      type: "ai",
      text: "We've stopped the breathing exercise. How are you feeling?",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    saveMessage(aiMessage);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Tabs defaultValue="chat" className="w-full">
      <TabsList className="mb-4 w-full md:w-auto">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="breathing">Breathing Exercises</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat" className="space-y-4">
        <Card className="mindshift-card h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl text-mindshift-raspberry flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-mindshift-lavender">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              MindShift Assistant
            </CardTitle>
            <CardDescription>
              Chat with our AI assistant for mental health support and guidance
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-grow overflow-hidden pb-0">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.type === 'user' 
                          ? 'bg-mindshift-raspberry text-white rounded-tr-none' 
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {isBreathing && currentBreathingExercise && (
                  <div className="flex justify-center my-4">
                    <div className="bg-mindshift-light rounded-2xl px-6 py-4 text-center">
                      <p className="font-medium text-mindshift-dark mb-2">{currentBreathingExercise.name}</p>
                      <div className="text-2xl font-bold text-mindshift-raspberry">
                        {currentBreathingExercise.steps[breathingStep]}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2" 
                        onClick={stopBreathingExercise}
                      >
                        <PauseIcon className="h-4 w-4 mr-1" /> Stop
                      </Button>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="pt-4">
            <div className="relative w-full">
              <Textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="pr-12 resize-none h-[80px]"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={input.trim() === "" || isTyping}
                className="absolute right-2 bottom-2 p-2 h-auto rounded-full bg-mindshift-raspberry hover:bg-mindshift-raspberry/90"
              >
                <SendIcon className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="breathing" className="space-y-4">
        <Card className="mindshift-card">
          <CardHeader>
            <CardTitle className="text-2xl text-mindshift-raspberry flex items-center gap-2">
              <TimerIcon className="h-6 w-6" />
              Breathing Exercises
            </CardTitle>
            <CardDescription>
              Practice these breathing techniques to help reduce stress and anxiety
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {breathingExercises.map((exercise, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600">{exercise.instructions}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => startBreathingExercise(index)}
                      disabled={isBreathing}
                      className="w-full"
                    >
                      Start Exercise
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {isBreathing && currentBreathingExercise && (
              <div className="mt-8 p-6 bg-mindshift-light rounded-xl text-center">
                <h3 className="text-xl font-medium text-mindshift-dark mb-4">{currentBreathingExercise.name}</h3>
                <div className="text-4xl font-bold text-mindshift-raspberry my-6 h-12">
                  {currentBreathingExercise.steps[breathingStep]}
                </div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="mt-4" 
                  onClick={stopBreathingExercise}
                >
                  <PauseIcon className="h-5 w-5 mr-2" /> Stop Exercise
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AIChat;
