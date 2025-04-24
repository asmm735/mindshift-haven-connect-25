
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface SoundOption {
  id: string;
  title: string;
  category: string;
  audio_url?: string;
  audio_file?: Uint8Array | string | null;
}

interface SoundSelectorProps {
  sounds: SoundOption[];
  selectedSound: SoundOption | null;
  onSelectSound: (sound: SoundOption) => void;
  volume: number;
  isPlaying?: boolean;
}

const SoundSelector = ({ sounds, selectedSound, onSelectSound, volume, isPlaying }: SoundSelectorProps) => {
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  const handlePreview = (sound: SoundOption) => {
    if (previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
      return;
    }

    if (sound.audio_url) {
      const audio = new Audio(sound.audio_url);
      audio.volume = volume / 100;
      audio.play().catch(console.error);
      setPreviewAudio(audio);
      
      // Stop preview after 3 seconds
      setTimeout(() => {
        audio.pause();
        setPreviewAudio(null);
      }, 3000);
    }
  };

  return (
    <RadioGroup 
      value={selectedSound?.id} 
      onValueChange={(id) => {
        const sound = sounds.find(s => s.id === id);
        if (sound) onSelectSound(sound);
      }}
      className="grid grid-cols-1 gap-2"
    >
      {sounds.map((sound) => (
        <div key={sound.id} className="flex items-center space-x-2 border rounded-md p-3">
          <RadioGroupItem value={sound.id} id={sound.id} />
          <Label htmlFor={sound.id} className="flex-1">{sound.title}</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.preventDefault();
              handlePreview(sound);
            }}
          >
            {previewAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      ))}
    </RadioGroup>
  );
};

export default SoundSelector;
