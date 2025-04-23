
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

// Predefined therapeutic responses for the AI chat
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

// Enhanced therapeutic responses for specific emotions
const anxietyResponses = [
  "I notice some anxiety in what you're sharing. Would a grounding exercise help right now?",
  "Anxiety can be really challenging to navigate. What helps you feel more centered when you experience these feelings?",
  "When anxiety builds up, our breathing often becomes shallow. Would you like to try a breathing exercise to help regulate your nervous system?",
  "Sometimes naming what we're afraid of can help reduce anxiety. Is there a specific concern at the heart of these feelings?"
];

const depressionResponses = [
  "It sounds like things have been really heavy lately. Have you been able to be gentle with yourself during this difficult time?",
  "Depression can make even small tasks feel overwhelming. What's one tiny step that might feel manageable today?",
  "When we're feeling down, our thoughts often become more negative. Have you noticed any patterns in your thinking lately?",
  "It takes courage to talk about these feelings. Have you considered speaking with a mental health professional about what you're experiencing?"
];

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
            const loadedMessages: Message[] = data.map((msg) => ({
              id: Number(
                typeof msg.id === "number"
                  ? msg.id
                  : typeof msg.id === "string"
                  ? parseInt(msg.id.slice(-6), 16) || Math.floor(Math.random() * 100000)
                  : Math.floor(Math.random() * 100000)
              ),
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

  const detectAnxietyOrDepression = (text: string): string | null => {
    const anxietyKeywords = ['anxious', 'anxiety', 'worried', 'stress', 'stressed',
      'panic', 'fear', 'scared', 'nervous', 'tense', 'overthinking'];
      
    const depressionKeywords = ['depressed', 'depression', 'sad', 'hopeless', 'overwhelmed',
      'exhausted', 'tired', 'can\'t sleep', 'insomnia', 'no energy', 'no motivation', 
      'worthless', 'suicidal', 'kill myself', 'end my life', 'don\'t want to live'];
    
    const textLower = text.toLowerCase();
    
    if (anxietyKeywords.some(keyword => textLower.includes(keyword))) {
      return "anxiety";
    }
    
    if (depressionKeywords.some(keyword => textLower.includes(keyword))) {
      return "depression";
    }
    
    return null;
  };

  const getTherapeuticResponse = (userInput: string): string => {
    const condition = detectAnxietyOrDepression(userInput);
    
    if (condition === "anxiety") {
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
    }
    
    if (condition === "depression") {
      return depressionResponses[Math.floor(Math.random() * depressionResponses.length)];
    }
    
    // Check if user mentioned breathing or exercises
    if (userInput.toLowerCase().includes("breath") || 
        userInput.toLowerCase().includes("exercise") || 
        userInput.toLowerCase().includes("calm") ||
        userInput.toLowerCase().includes("relax")) {
      return "Would you like to try one of our breathing exercises? They can be really helpful for finding calm in difficult moments.";
    }
    
    // Default responses for general conversation
    return aiResponses[Math.floor(Math.random() * aiResponses.length)];
  };

  const simulateTyping = (response: string, callback: (text: string) => void) => {
    let i = 0;
    const typingSpeed = 25; // milliseconds per character
    const responseLength = response.length;
    
    const typingInterval = setInterval(() => {
      i++;
      if (i > responseLength) {
        clearInterval(typingInterval);
        callback(response);
      }
    }, typingSpeed);
    
    // Safety timeout to ensure response always completes (3-10 seconds based on length)
    setTimeout(() => {
      clearInterval(typingInterval);
      callback(response);
    }, Math.min(10000, Math.max(3000, responseLength * typingSpeed * 1.5)));
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || isTyping) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    saveMessage(userMessage);
    setInput("");
    setIsTyping(true);

    // Generate a therapeutic response
    const aiResponse = getTherapeuticResponse(userMessage.text);
    
    // Add a small delay and typing simulation for realism
    setTimeout(() => {
      simulateTyping(aiResponse, (finalResponse) => {
        const aiMessage: Message = {
          id: messages.length + 2,
          type: "ai",
          text: finalResponse,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        saveMessage(aiMessage);
        setIsTyping(false);
      });
    }, 1000);
  };

  // Breathing: Slower pace as requested
  const startBreathingExercise = (exerciseIndex: number) => {
    if (isBreathing) return;

    const exercise = breathingExercises[exerciseIndex];
    setCurrentBreathingExercise(exercise);
    setBreathingStep(0);
    setIsBreathing(true);

    let currentStep = 0;
    let stepTimeElapsed = 0;
    const stepCheckInterval = 500; // Check every 500ms

    // Pace multiplier (slow everything down: base is 1, 2 is twice as slow)
    const pacingMultiplier = 2.2; // 2.2x slower than before

    const aiMessage: Message = {
      id: messages.length + 1,
      type: "ai",
      text: `Let's begin the ${exercise.name}. ${exercise.instructions} We'll move through each step calmly—just follow along.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    saveMessage(aiMessage);

    breathingIntervalRef.current = setInterval(() => {
      stepTimeElapsed += stepCheckInterval / 1000;
      if (
        stepTimeElapsed >=
        exercise.stepDurations[currentStep % exercise.steps.length] * pacingMultiplier
      ) {
        currentStep++;
        setBreathingStep(currentStep % exercise.steps.length);
        stepTimeElapsed = 0;
      }
    }, stepCheckInterval);

    // Calculate slower total duration: 3 relaxed cycles
    const totalDuration =
      exercise.stepDurations.reduce((a, b) => a + b, 0) * pacingMultiplier * 3;

    setTimeout(() => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
        breathingIntervalRef.current = null;
      }
      setIsBreathing(false);

      const completionMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        text: "Wonderful. You've finished the exercise. Notice how you feel—well done for taking this step for your wellbeing.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, completionMessage]);
      saveMessage(completionMessage);
    }, totalDuration * 1000);
  };

  const stopBreathingExercise = () => {
    if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current);
      breathingIntervalRef.current = null;
    }
    setIsBreathing(false);
    
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
                      <div className="text-2xl font-bold text-mindshift-raspberry animate-pulse duration-1000">
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
                <div className="text-4xl font-bold text-mindshift-raspberry my-6 h-12 animate-pulse duration-1000">
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
