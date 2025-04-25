import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Timer, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import SoundSelector from "./SoundSelector";

type TimerMode = "focus";

interface TimerSettings {
  focus: number;
}

interface SoundOption {
  id: string;
  title: string;
  category: string;
  audio_url?: string; 
  audio_file?: Uint8Array | string | null;
}

const defaultSettings: TimerSettings = {
  focus: 25,
};

const notificationSoundUrl = "https://soundbible.com/mp3/Electronic_Chime-KevanGC-495939803.mp3";

const PomodoroTimer = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [timeRemaining, setTimeRemaining] = useState(settings.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [focusSessions, setFocusSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [volume, setVolume] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const notificationRef = useRef<HTMLAudioElement | null>(null);

  const { 
    data: soundOptionsData = [], 
    isLoading: isSoundsLoading,
    error: soundsError 
  } = useQuery({
    queryKey: ['soundTracks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sound_therapy_tracks')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const soundOptions = useMemo(() => 
    soundOptionsData.map(track => ({
      id: track.id,
      title: track.title,
      category: track.category,
      audio_url: track.audio_url || '',
      description: track.description
    })), [soundOptionsData]);

  const [selectedSound, setSelectedSound] = useState<SoundOption | null>(
    soundOptions.length > 0 ? soundOptions[0] : null
  );

  useEffect(() => {
    if (soundOptions.length > 0 && !selectedSound) {
      setSelectedSound(soundOptions[0]);
    }
  }, [soundOptions]);

  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume / 100;
      audioRef.current.preload = "auto";

      notificationRef.current = new Audio();
      notificationRef.current.src = notificationSoundUrl;
      notificationRef.current.volume = 0.7;
      notificationRef.current.preload = "auto";

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

  useEffect(() => {
    if (selectedSound && audioRef.current && selectedSound.audio_url) {
      audioRef.current.src = selectedSound.audio_url;
      audioRef.current.loop = true;

      if (soundEnabled && isRunning) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [selectedSound, soundEnabled, isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (notificationRef.current) {
      notificationRef.current.currentTime = 0;
      notificationRef.current.play().catch(() => {});
    }
    setFocusSessions((prev) => prev + 1);
    toast({
      title: "Focus session completed!",
      description: "Great job! Take a well-deserved break.",
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateProgress = (): number => {
    const totalSeconds = settings.focus * 60;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(settings.focus * 60);
  };

  const handleSettingChange = (mode: keyof TimerSettings, value: number[]) => {
    setSettings({...settings, [mode]: value[0]});
  };

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
  };

  const handleSoundSelection = (soundId: string) => {
    const sound = soundOptions.find(s => s.id === soundId);
    if (sound) setSelectedSound(sound);
  };

  const previewAudio = (sound: SoundOption) => {
    if (!sound.audio_url) return;
    const audio = new Audio(sound.audio_url);
    audio.volume = volume / 100;
    audio.play().catch(() => {});
    setTimeout(() => audio.pause(), 3000);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      if (soundEnabled && audioRef.current && selectedSound?.audio_url) {
        audioRef.current.play().catch(() => {});
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
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
  }, [isRunning, soundEnabled, selectedSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (soundEnabled && isRunning && selectedSound?.audio_url) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [soundEnabled, isRunning, selectedSound]);

  const renderSoundSelector = () => {
    if (isSoundsLoading) {
      return <div>Loading sounds...</div>;
    }

    return (
      <SoundSelector
        sounds={soundOptions}
        selectedSound={selectedSound}
        onSelectSound={setSelectedSound}
        volume={volume}
        isPlaying={isRunning && soundEnabled}
      />
    );
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
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="sounds">Sound Therapy</TabsTrigger>
          </TabsList>
          <TabsContent value="timer" className="space-y-4">
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
                    className="text-mindshift-raspberry"
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
                <Button onClick={handleStartPause} className="mindshift-button px-6 py-2 rounded-full">
                  {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button onClick={handleReset} variant="outline" className="px-6 py-2 rounded-full">
                  Reset
                </Button>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Session count: {focusSessions}
              </div>
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
                  {renderSoundSelector()}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Volume: {volume}%</label>
                    <div className="flex items-center gap-2">
                      <VolumeX className="h-4 w-4 cursor-pointer" onClick={() => setVolume(0)} />
                      <Volume2 className="h-4 w-4 cursor-pointer" onClick={() => setVolume(100)} />
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
