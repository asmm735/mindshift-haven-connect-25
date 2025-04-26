
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SendIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BreathingExercise } from "./BreathingExerciseSection";

export interface Message {
  id: number;
  type: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  isTyping: boolean;
  isBreathing: boolean;
  currentBreathingExercise: BreathingExercise | null;
  breathingStep: number;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onStopBreathingExercise: () => void;
}

const ChatInterface = ({
  messages,
  input,
  isTyping,
  isBreathing,
  currentBreathingExercise,
  breathingStep,
  onInputChange,
  onKeyDown,
  onSendMessage,
  onStopBreathingExercise
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
                    onClick={onStopBreathingExercise}
                  >
                    Stop
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
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder="Type your message here..."
            className="pr-12 resize-none h-[80px]"
            disabled={isTyping}
          />
          <Button
            onClick={onSendMessage}
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

export default ChatInterface;
