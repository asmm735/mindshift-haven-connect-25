
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Timer, Volume2, Volume1, VolumeX, Music } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type TimerMode = "focus" | "shortBreak" | "longBreak";

interface TimerSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

interface SoundOption {
  id: string;
  name: string;
  src: string;
}

const defaultSettings: TimerSettings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

// Corrected sound options with working URLs for better accessibility
const soundOptions: SoundOption[] = [
  { id: "rain", name: "Rain", src: "https://soundbible.com/mp3/rain_thunder-Mike_Koenig-694151151.mp3" }, 
  { id: "forest", name: "Forest", src: "https://soundbible.com/mp3/forest-fire-daniel_simon.mp3" }, 
  { id: "ocean", name: "Ocean Waves", src: "https://soundbible.com/mp3/Ocean_Waves-Mike_Koenig-980635285.mp3" }, 
  { id: "bonfire", name: "Bonfire", src: "https://soundbible.com/mp3/Fire_Crackling-Mike_Koenig-1921202700.mp3" }, 
  { id: "gamma", name: "Gamma Waves", src: "https://soundbible.com/mp3/meadow-ambience-daniel_simon.mp3" }, 
  { id: "alpha", name: "Alpha Waves", src: "https://soundbible.com/mp3/bubbling-daniel_simon.mp3" }, 
  { id: "beta", name: "Beta Waves", src: "https://soundbible.com/mp3/crossing_link-daniel_simon.mp3" }, 
];

// Create notification sound URL with reliable source
const notificationSoundUrl = "https://soundbible.com/mp3/Electronic_Chime-KevanGC-495939803.mp3";

const PomodoroTimer = () => {
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [currentMode, setCurrentMode] = useState<TimerMode>("focus");
  const [timeRemaining, setTimeRemaining] = useState(settings.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [focusSessions, setFocusSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundOption>(soundOptions[0]);
  const [volume, setVolume] = useState(90); // Set default volume to 90 (high)
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const notificationRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize audio elements with preloading
  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      // Create and configure audio elements
      audioRef.current = new Audio();
      audioRef.current.src = selectedSound.src;
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;
      audioRef.current.preload = "auto"; // Ensure preloading

      notificationRef.current = new Audio();
      notificationRef.current.src = notificationSoundUrl;
      notificationRef.current.volume = 0.7;
      notificationRef.current.preload = "auto"; // Ensure preloading

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        if (notificationRef.current) {
          notificationRef.current = null;
        }
      };
    }
  }, []);

  // Update time remaining when mode or settings change
  useEffect(() => {
    setTimeRemaining(settings[currentMode] * 60);
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [currentMode, settings]);

  // Handle sound selection
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = selectedSound.src;
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;
      
      if (soundEnabled && isRunning) {
        playAudio(audioRef.current);
      }
    }
  }, [selectedSound]);

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle sound toggle
  useEffect(() => {
    if (audioRef.current) {
      if (soundEnabled && isRunning) {
        playAudio(audioRef.current);
      } else {
        audioRef.current.pause();
      }
    }
  }, [soundEnabled, isRunning]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer finished
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start sound if enabled
      if (soundEnabled && audioRef.current) {
        playAudio(audioRef.current);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Pause sound if timer is not running
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning]);

  // Helper function to play audio with error handling
  const playAudio = (audio: HTMLAudioElement) => {
    // Reset audio to beginning before playing
    audio.currentTime = 0;
    
    const playPromise = audio.play();
    
    // Handle play() promise to catch any errors
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Audio playback started successfully
        })
        .catch(error => {
          console.error("Audio playback error:", error);
          // Try to recover by recreating the audio element
          if (audio === audioRef.current && audioRef.current) {
            const newAudio = new Audio(selectedSound.src);
            newAudio.loop = true;
            newAudio.volume = volume / 100;
            audioRef.current = newAudio;
            newAudio.play().catch(e => console.error("Recovery playback failed:", e));
          }
        });
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Play notification sound
    if (notificationRef.current) {
      playAudio(notificationRef.current);
    }
    
    if (currentMode === "focus") {
      const newFocusSessions = focusSessions + 1;
      setFocusSessions(newFocusSessions);
      
      toast({
        title: "Focus session completed!",
        description: "Great job! Take a well-deserved break.",
      });
      
      if (newFocusSessions % 4 === 0) {
        setCurrentMode("longBreak");
      } else {
        setCurrentMode("shortBreak");
      }
    } else {
      setCurrentMode("focus");
      toast({
        title: "Break time over",
        description: "Ready to focus again?",
      });
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateProgress = (): number => {
    const totalSeconds = settings[currentMode] * 60;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(settings[currentMode] * 60);
  };

  const handleSettingChange = (mode: keyof TimerSettings, value: number[]) => {
    setSettings({
      ...settings,
      [mode]: value[0],
    });
  };

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
  };

  const handleSoundSelection = (soundId: string) => {
    const sound = soundOptions.find(s => s.id === soundId);
    if (sound) {
      setSelectedSound(sound);
    }
  };

  // Function to switch timer modes directly
  const switchTimerMode = (mode: TimerMode) => {
    setCurrentMode(mode);
    setTimeRemaining(settings[mode] * 60);
    setIsRunning(false);
    
    // Stop any running intervals
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Helper function to preview audio
  const previewAudio = (sound: SoundOption) => {
    // Create a temporary audio element for preview
    const previewAudio = new Audio(sound.src);
    previewAudio.volume = volume / 100;
    
    const playPromise = previewAudio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(e => console.error("Audio preview failed:", e));
      
      // Play for 3 seconds then pause
      setTimeout(() => {
        previewAudio.pause();
        previewAudio.remove(); // Clean up
      }, 3000);
    }
  };

  return (
    <Card className="mindshift-card max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-mindshift-raspberry flex items-center gap-2">
          <Timer className="h-6 w-6" />
          Pomodoro Timer
        </CardTitle>
        <CardDescription>
          Boost your productivity with timed work and break sessions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="sounds">Sound Therapy</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="space-y-4">
            <div className="flex justify-center mb-6">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger 
                  value="focus" 
                  onClick={() => switchTimerMode("focus")}
                  className={currentMode === "focus" ? "bg-mindshift-raspberry text-white" : ""}
                >
                  Focus
                </TabsTrigger>
                <TabsTrigger 
                  value="shortBreak" 
                  onClick={() => switchTimerMode("shortBreak")}
                  className={currentMode === "shortBreak" ? "bg-mindshift-lavender text-white" : ""}
                >
                  Short Break
                </TabsTrigger>
                <TabsTrigger 
                  value="longBreak" 
                  onClick={() => switchTimerMode("longBreak")}
                  className={currentMode === "longBreak" ? "bg-mindshift-dark text-white" : ""}
                >
                  Long Break
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="text-center space-y-4">
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-mindshift-raspberry">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={`${
                      currentMode === "focus" 
                        ? "text-mindshift-raspberry" 
                        : currentMode === "shortBreak" 
                          ? "text-mindshift-lavender" 
                          : "text-mindshift-dark"
                    }`}
                    strokeWidth="4"
                    strokeDasharray={283}
                    strokeDashoffset={283 - (283 * calculateProgress()) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                </svg>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={handleStartPause}
                  className="mindshift-button px-6 py-2 rounded-full"
                >
                  {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="px-6 py-2 rounded-full"
                >
                  Reset
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                Session count: {focusSessions}
              </div>

              {/* Sound Quick Toggle */}
              <div className="flex items-center justify-center space-x-2 mt-4 pt-2 border-t border-gray-100">
                <Label htmlFor="sound-toggle" className="text-sm text-gray-600">Background Sound</Label>
                <Switch 
                  id="sound-toggle" 
                  checked={soundEnabled}
                  onCheckedChange={handleSoundToggle}
                />
                {soundEnabled && (
                  <div className="flex items-center gap-2">
                    <VolumeX 
                      className={`h-4 w-4 cursor-pointer ${volume === 0 ? 'text-mindshift-raspberry' : 'text-gray-400'}`}
                      onClick={() => setVolume(0)}
                    />
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      className="w-20"
                      onValueChange={(value) => setVolume(value[0])}
                    />
                    <Volume2 
                      className={`h-4 w-4 cursor-pointer ${volume > 50 ? 'text-mindshift-raspberry' : 'text-gray-400'}`}
                      onClick={() => setVolume(100)}
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sounds" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">Sound Therapy</h4>
                  <p className="text-xs text-gray-500">Play calming sounds during your focus sessions</p>
                </div>
                <Switch 
                  id="sound-toggle-main" 
                  checked={soundEnabled}
                  onCheckedChange={handleSoundToggle}
                />
              </div>

              <div className={`space-y-4 ${!soundEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Sound</label>
                  <RadioGroup 
                    value={selectedSound.id} 
                    onValueChange={handleSoundSelection}
                    className="grid grid-cols-1 gap-2"
                  >
                    {soundOptions.map((sound) => (
                      <div key={sound.id} className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value={sound.id} id={sound.id} />
                        <Label htmlFor={sound.id} className="flex-1">{sound.name}</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent changing selection
                            previewAudio(sound);
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Volume: {volume}%</label>
                    <div className="flex items-center gap-2">
                      <VolumeX 
                        className="h-4 w-4 cursor-pointer" 
                        onClick={() => setVolume(0)}
                      />
                      <Volume2 
                        className="h-4 w-4 cursor-pointer" 
                        onClick={() => setVolume(100)}
                      />
                    </div>
                  </div>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                  />
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Sound will play automatically when the timer is running. You can 
                    toggle sounds quickly from the timer screen.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Focus Duration: {settings.focus} min</label>
                <Slider
                  value={[settings.focus]}
                  min={5}
                  max={60}
                  step={5}
                  onValueChange={(value) => handleSettingChange("focus", value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Short Break: {settings.shortBreak} min</label>
                <Slider
                  value={[settings.shortBreak]}
                  min={1}
                  max={15}
                  step={1}
                  onValueChange={(value) => handleSettingChange("shortBreak", value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Long Break: {settings.longBreak} min</label>
                <Slider
                  value={[settings.longBreak]}
                  min={10}
                  max={30}
                  step={5}
                  onValueChange={(value) => handleSettingChange("longBreak", value)}
                />
              </div>
              
              {/* Test notification sound */}
              <div className="pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (notificationRef.current) {
                      playAudio(notificationRef.current);
                    }
                  }}
                  className="w-full"
                >
                  Test Notification Sound
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <p className="text-xs text-gray-500 text-center">
          The Pomodoro Technique helps you maintain focus and take regular breaks for optimal productivity.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PomodoroTimer;
