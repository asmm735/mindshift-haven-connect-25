// List of basic greetings
const greetings = ["hi", "hello", "hey", "greetings", "howdy", "yo"];

// List of profanities to filter
const profanityList = [
  // English profanities
  "fuck", "shit", "ass", "bitch", "dick", "pussy", "cunt", "cock", "whore", "bastard",
  // Hindi/Urdu profanities
  "lavde", "bkl", "gandu", "chutiya", "behenchod", "madarchod", "bhosdike", "randi",
  // Spanish profanities
  "puta", "pendejo", "cabron", "mierda", "joder",
  // French profanities
  "putain", "merde", "connard",
  // Generic
  "fucker", "motherfucker", "asshole", "dickhead"
];

// Mental health related keywords
const anxietyKeywords = [
  "anxious", "anxiety", "worried", "worry", "stress", "stressed",
  "panic", "fear", "scared", "nervous", "tense", "overthinking",
  "afraid", "uneasy", "dread", "concerned", "apprehensive"
];

const depressionKeywords = [
  "depressed", "depression", "sad", "hopeless", "overwhelmed",
  "exhausted", "tired", "can't sleep", "insomnia", "no energy", "no motivation", 
  "worthless", "suicidal", "kill myself", "end my life", "don't want to live",
  "empty", "numb", "pointless", "meaningless", "unhappy", "miserable", "low"
];

const angerKeywords = [
  "angry", "anger", "mad", "furious", "irritated", "frustrated", 
  "annoyed", "rage", "resentment", "outraged", "pissed", "hate"
];

// Generic negative emotion keywords
const negativeEmotionKeywords = [
  "lonely", "alone", "isolated", "rejected", "hurt", "pain", 
  "grief", "grieving", "lost", "confused", "disappointed", "upset", 
  "guilty", "shame", "embarrassed", "helpless", "heartbroken"
];

// Greeting responses - more varied and engaging
const greetingResponses = [
  "Hey there! How are you feeling today?",
  "Hello! I'm here to listen. How's your day going?",
  "Hi! I'm your MindShift assistant. What's on your mind?",
  "Hey! I'm here for you. Want to talk about how you're feeling?",
  "Hello there! How can I support you today?",
  "Hi! I'm listening — how are you doing right now?",
  "Hey! It's good to see you. How's your mental health today?",
  "Hello! I'm here to chat. How are you feeling at the moment?"
];

// Responses to inappropriate language
const profanityResponses = [
  "I understand you might be feeling frustrated, but let's try to keep our conversation respectful so I can help you better.",
  "It seems like you're upset, which is completely valid. Would you like to talk about what's bothering you in different words?",
  "I'm here to support you through difficult emotions. Let's try to express them in a way that helps us have a productive conversation.",
  "I notice you're using strong language. That's okay, but I can help you better if we communicate in a more constructive way. What's going on?",
  "Sometimes strong words come out when we're feeling strong emotions. I'm here to listen - would you like to tell me more about what you're experiencing?"
];

// Responses for anxiety
const anxietyResponses = [
  "I notice you might be feeling anxious. Would it help to try a quick breathing exercise together?",
  "Anxiety can feel overwhelming sometimes. Would you like to explore some grounding techniques that might help in this moment?",
  "It sounds like you're experiencing some worry or anxiety. What typically helps you when you're feeling this way?",
  "When anxiety builds up, our breathing often becomes shallow. Would you like to try a simple breathing exercise to help regulate your nervous system?",
  "I hear that you're feeling anxious. Sometimes naming what we're afraid of can help reduce anxiety. Is there a specific concern at the heart of these feelings?",
  "Anxiety often comes with physical sensations. Are you noticing any physical discomfort right now that we could address?",
  "It takes courage to share feelings of anxiety. Would trying our breathing exercises section help right now?"
];

// Responses for depression
const depressionResponses = [
  "I hear that things feel heavy for you right now. Would it help to talk more about what you're experiencing?",
  "Depression can make even small tasks feel overwhelming. What's one tiny step that might feel manageable for you today?",
  "I'm really sorry you're feeling this way. Sometimes our thoughts become more negative when we're feeling down. Have you noticed any patterns in your thinking lately?",
  "You're not alone in these feelings. Many people experience depression. Would it help to talk about some coping strategies or resources?",
  "Thank you for sharing how you're feeling with me. Would you like to explore some small actions that might help lift your mood even slightly?",
  "When we're feeling depressed, it can be hard to see past the present moment. Just know that I'm here with you, and these feelings won't last forever.",
  "Depression can feel isolating, but you're not alone. Would you like to look at some supportive resources together?",
  "It takes courage to share these feelings. Have you tried tracking your mood patterns in our mood tracker? Sometimes seeing patterns can help."
];

// Responses for anger
const angerResponses = [
  "I can hear that you're feeling frustrated or angry. That's a completely valid emotion. Would you like to talk more about what triggered this feeling?",
  "Anger is often a signal that something important to us has been threatened or violated. Does that resonate with what you're experiencing?",
  "When we're angry, our bodies can feel tense. Would it help to try a quick relaxation exercise to release some of that physical tension?",
  "I hear your frustration. Sometimes writing down what we're angry about can help us process the emotion. Would you like to share more about what's making you feel this way?",
  "Anger can sometimes mask other emotions like hurt or fear. Is there anything beneath the anger that you're aware of?",
  "It sounds like you're dealing with some strong feelings right now. Would taking a few deep breaths together help before we continue talking?"
];

// Responses for general negative emotions
const negativeEmotionResponses = [
  "I'm sorry you're feeling this way. Would you like to talk more about what's happening?",
  "Thank you for sharing that with me. How long have you been feeling this way?",
  "That sounds challenging. What kind of support would feel most helpful right now?",
  "I'm here with you. What thoughts or feelings are coming up for you as we talk?",
  "It takes courage to share these feelings. Would it help to explore some coping strategies together?",
  "I notice what you're saying. How has this been affecting your daily life?",
  "You're not alone in what you're experiencing. Many people go through similar challenges. What has helped you cope in the past?",
  "I'm listening. Would you like to talk more about how this is impacting you?",
  "That makes sense given what you're going through. How are you taking care of yourself during this difficult time?",
  "I appreciate you trusting me with this. What would feel like a small step forward right now?"
];

// General therapeutic responses
const generalTherapeuticResponses = [
  "I hear you. Could you tell me more about what you're experiencing right now?",
  "Thank you for sharing that with me. How long have you been feeling this way?",
  "That sounds challenging. What kind of support would feel most helpful right now?",
  "I'm here with you. What thoughts or feelings are coming up for you as we talk?",
  "It takes courage to share these feelings. Would it help to explore some coping strategies together?",
  "I notice what you're saying. How has this been affecting your daily life?",
  "You're not alone in what you're experiencing. Many people go through similar challenges. What has helped you cope in the past?",
  "I'm listening. Would you like to talk more about how this is impacting you?",
  "That makes sense given what you're going through. How are you taking care of yourself during this difficult time?",
  "I appreciate you trusting me with this. What would feel like a small step forward right now?"
];

// Add small talk responses for general conversation
const smallTalkResponses = [
  "What did you do today?",
  "Have you taken a break lately?",
  "What's something that made you smile recently?",
  "How has your week been going?",
  "Is there anything specific you'd like to talk about?",
  "What helps you relax when you need to unwind?",
  "Have you tried any new activities lately?",
  "What's been on your mind today?",
  "How do you usually spend your free time?",
  "What's a small victory you've had recently?"
];

// Function to detect greetings
export const isGreeting = (text: string): boolean => {
  const lowerText = text.toLowerCase().trim();
  return greetings.some(greeting => lowerText === greeting || lowerText.startsWith(`${greeting} `));
};

// Function to detect profanity
export const containsProfanity = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return profanityList.some(word => 
    lowerText.includes(word) || 
    lowerText.split(/\s+/).some(w => w === word || w.replace(/[^\w]/g, '') === word)
  );
};

// Function to detect emotional state based on input text
export const detectEmotionalState = (text: string): string | null => {
  const lowerText = text.toLowerCase();
  
  // Check for anxiety
  if (anxietyKeywords.some(keyword => lowerText.includes(keyword))) {
    return "anxiety";
  }
  
  // Check for depression
  if (depressionKeywords.some(keyword => lowerText.includes(keyword))) {
    return "depression";
  }
  
  // Check for anger
  if (angerKeywords.some(keyword => lowerText.includes(keyword))) {
    return "anger";
  }
  
  // Check for general negative emotions
  if (negativeEmotionKeywords.some(keyword => lowerText.includes(keyword))) {
    return "negative";
  }
  
  return null;
};

// Function that checks if the message mentions breathing or exercises
export const mentionsBreathingOrExercises = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return lowerText.includes("breath") || 
         lowerText.includes("exercise") || 
         lowerText.includes("calm") ||
         lowerText.includes("relax") ||
         lowerText.includes("meditation") ||
         lowerText.includes("technique");
};

// Function to get a therapeutic response based on user input
export const getTherapeuticResponse = (userInput: string, previousMessages: string[] = []): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Get a unique response that hasn't been used recently
  const getUniqueResponse = (responses: string[]): string => {
    let filteredResponses = responses.filter(r => 
      !previousMessages.slice(-5).some(msg => 
        msg.toLowerCase().includes(r.substring(0, 15).toLowerCase())
      )
    );
    
    // If all responses have been used recently, reset and use any
    if (filteredResponses.length === 0) {
      filteredResponses = responses;
    }
    
    return filteredResponses[Math.floor(Math.random() * filteredResponses.length)];
  };

  // Check for greetings
  if (isGreeting(lowerInput)) {
    return getUniqueResponse(greetingResponses);
  }
  
  // Check for profanity
  if (containsProfanity(lowerInput)) {
    return getUniqueResponse(profanityResponses);
  }
  
  // Detect emotional state
  const emotionalState = detectEmotionalState(lowerInput);
  
  // Return appropriate response based on emotional state
  if (emotionalState === "anxiety") {
    return getUniqueResponse(anxietyResponses);
  }
  
  if (emotionalState === "depression") {
    return getUniqueResponse(depressionResponses);
  }
  
  if (emotionalState === "anger") {
    return getUniqueResponse(angerResponses);
  }
  
  if (emotionalState === "negative") {
    return getUniqueResponse(negativeEmotionResponses);
  }
  
  // Check if user mentioned breathing or exercises
  if (mentionsBreathingOrExercises(lowerInput)) {
    return "Would you like to try one of our breathing exercises? They can be really helpful for finding calm in difficult moments.";
  }
  
  // If no specific triggers are detected, engage in small talk
  return getUniqueResponse(smallTalkResponses);
};
