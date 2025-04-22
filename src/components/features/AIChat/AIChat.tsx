
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock AI responses (would be replaced with actual AI API in production)
const aiResponses = [
  "I understand that you're feeling this way. It's normal to experience these emotions.",
  "What specific thoughts are coming up for you when you feel this way?",
  "That sounds challenging. Have you tried any relaxation techniques that have worked for you in the past?",
  "It's brave of you to share these feelings. Would it help to talk about what might have triggered this?",
  "I hear you're going through a difficult time. Let's explore some small steps that might help you feel more grounded.",
  "Your feelings are valid. Sometimes just acknowledging them can be a powerful first step.",
  "When we experience this, our bodies often respond with physical sensations too. Have you noticed any physical reactions?",
  "Many people find that mindfulness helps in moments like these. Would you like to try a brief mindfulness exercise?",
  "It sounds like you're being quite hard on yourself. How would you respond to a friend sharing the same concerns?",
  "I'm here to support you. What kind of help would feel most useful right now?"
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (input.trim() === "" || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * aiResponses.length);
      const aiMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        text: aiResponses[randomIndex],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
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
  );
};

export default AIChat;
