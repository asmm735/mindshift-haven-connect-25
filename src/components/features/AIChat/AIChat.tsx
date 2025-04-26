
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TimerIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessage } from "@/types/supabase-custom";
import { getTherapeuticResponse } from "./utils/chatUtils";
import ChatInterface, { Message } from "./ChatInterface";
import BreathingExerciseSection, { BreathingExercise } from "./BreathingExerciseSection";

const breathingExercises: BreathingExercise[] = [
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
  const [currentBreathingExercise, setCurrentBreathingExercise] = useState<BreathingExercise | null>(null);
  const [breathingStep, setBreathingStep] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const { toast } = useToast();
  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
            const loadedMessages: Message[] = data.map((msg: ChatMessage) => ({
              id: Number(
                typeof msg.id === "number"
                  ? msg.id
                  : typeof msg.id === "string"
                  ? parseInt(msg.id.slice(-6), 16) || Math.floor(Math.random() * 100000)
                  : Math.floor(Math.random() * 100000)
              ),
              type: msg.type as "user" | "ai",
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

  // Get previous AI responses for avoiding repetitive responses
  const getPreviousAIMessages = () => {
    return messages
      .filter(msg => msg.type === "ai")
      .map(msg => msg.text)
      .slice(-5);
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

    // Get recent AI messages to avoid repetition
    const previousAIMessages = getPreviousAIMessages();
    
    // Generate a therapeutic response based on user input
    const aiResponse = getTherapeuticResponse(userMessage.text, previousAIMessages);
    
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

  const startBreathingExercise = (exerciseIndex: number) => {
    if (isBreathing) return;

    const exercise = breathingExercises[exerciseIndex];
    setCurrentBreathingExercise(exercise);
    setBreathingStep(0);
    setIsBreathing(true);

    let currentStep = 0;
    let stepTimeElapsed = 0;
    const stepCheckInterval = 500; // Check every 500ms

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

  return (
    <Tabs defaultValue="chat" className="w-full">
      <TabsList className="mb-4 w-full md:w-auto">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="breathing">Breathing Exercises</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat" className="space-y-4">
        <ChatInterface
          messages={messages}
          input={input}
          isTyping={isTyping}
          isBreathing={isBreathing}
          currentBreathingExercise={currentBreathingExercise}
          breathingStep={breathingStep}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSendMessage={handleSendMessage}
          onStopBreathingExercise={stopBreathingExercise}
        />
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
            <BreathingExerciseSection
              breathingExercises={breathingExercises}
              isBreathing={isBreathing}
              currentBreathingExercise={currentBreathingExercise}
              breathingStep={breathingStep}
              onStartExercise={startBreathingExercise}
              onStopExercise={stopBreathingExercise}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AIChat;
