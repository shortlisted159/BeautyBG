
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Upload } from "lucide-react";

export type Background = {
  name: string;
  value: string;
  class: string;
};

export type BackgroundType = "gradient" | "plain" | "image";

const defaultGradients: Background[] = [
  { name: "Beach", value: "#00d2ff,#3a7bd5", class: "bg-gradient-beach" },
  { name: "Cool", value: "#accbee,#e7f0fd", class: "bg-gradient-cool" },
  { name: "Violet", value: "#7028e4,#e5b2ca", class: "bg-gradient-violet" },
  { name: "Rose", value: "#ee9ca7,#ffdde1", class: "bg-gradient-rose" },
  { name: "Love", value: "#ff758c,#ff7eb3", class: "bg-gradient-love" },
  { name: "Flower", value: "#a18cd1,#fbc2eb", class: "bg-gradient-flower" },
  { name: "Sky", value: "#89f7fe,#66a6ff", class: "bg-gradient-sky" },
  { name: "Sunset", value: "#f97316,#d946ef", class: "bg-gradient-to-r from-[#f97316] to-[#d946ef]" },
  { name: "Ocean", value: "#0ea5e9,#6366f1", class: "bg-gradient-to-r from-[#0ea5e9] to-[#6366f1]" },
  { name: "Forest", value: "#22c55e,#14b8a6", class: "bg-gradient-to-r from-[#22c55e] to-[#14b8a6]" },
  { name: "Candy", value: "#f472b6,#9333ea", class: "bg-gradient-to-r from-[#f472b6] to-[#9333ea]" },
  { name: "Morning", value: "#ff9a9e,#fad0c4", class: "bg-gradient-to-r from-[#ff9a9e] to-[#fad0c4]" },
  { name: "Bright", value: "#c471f5,#fa71cd", class: "bg-gradient-to-r from-[#c471f5] to-[#fa71cd]" },
  { name: "Nice", value: "#ff758c,#ff7eb3", class: "bg-gradient-to-r from-[#ff758c] to-[#ff7eb3]" },
  { name: "Rain", value: "#89f7fe,#66a6ff", class: "bg-gradient-to-r from-[#89f7fe] to-[#66a6ff]" },
  { name: "Charm", value: "#f6d365,#fda085", class: "bg-gradient-to-r from-[#f6d365] to-[#fda085]" },
  { name: "White", value: "#ffffff", class: "bg-white" },
  { name: "Black", value: "#000000", class: "bg-black" },
  { name: "None", value: "transparent", class: "bg-transparent-grid" },
];

interface GradientSelectorProps {
  selectedBackground: Background;
  onSelectBackground: (background: Background) => void;
  backgroundType: BackgroundType;
  onBackgroundTypeChange: (type: BackgroundType) => void;
  onBackgroundImageSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  backgroundImageInputRef?: React.RefObject<HTMLInputElement>;
}

const GradientSelector: React.FC<GradientSelectorProps> = ({ 
  selectedBackground,
  onSelectBackground,
  backgroundType,
  onBackgroundTypeChange,
  onBackgroundImageSelect,
  backgroundImageInputRef,
}) => {
  const [color1, setColor1] = useState("#ff758c");
  const [color2, setColor2] = useState("#ff7eb3");
  const [plainColor, setPlainColor] = useState("#50b7f5");
  
  // Initialize plain color from selected background if needed
  useEffect(() => {
    if (backgroundType === "plain") {
      if (selectedBackground.value.includes(',')) {
        setPlainColor(selectedBackground.value.split(',')[0]);
      } else {
        setPlainColor(selectedBackground.value);
      }
    }
  }, [backgroundType, selectedBackground]);

  const handleCreateCustomGradient = () => {
    const newCustomGradient: Background = {
      name: `Custom`,
      value: `${color1},${color2}`,
      class: `bg-gradient-to-r from-[${color1}] to-[${color2}]`
    };
    // Apply the gradient immediately without adding to list
    onSelectBackground(newCustomGradient);
  };

  const handlePlainColorChange = (color: string) => {
    setPlainColor(color);
    onSelectBackground({
      name: "Plain Color",
      value: color,
      class: `bg-[${color}]`
    });
  };

  return (
    <div className="space-y-3">
      <Label>Background</Label>
      
      <div className="flex space-x-2 mb-3">
        <Button 
          variant={backgroundType === "plain" ? "default" : "outline"} 
          size="sm" 
          onClick={() => onBackgroundTypeChange("plain")}
        >
          Plain Color
        </Button>
        <Button 
          variant={backgroundType === "gradient" ? "default" : "outline"} 
          size="sm"
          onClick={() => onBackgroundTypeChange("gradient")}
        >
          Gradient
        </Button>
        <Button 
          variant={backgroundType === "image" ? "default" : "outline"} 
          size="sm"
          onClick={() => onBackgroundTypeChange("image")}
        >
          Image
        </Button>
      </div>

      {backgroundType === "plain" && (
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <Input 
              type="color" 
              value={plainColor} 
              onChange={(e) => handlePlainColorChange(e.target.value)}
              className="w-12 p-1 h-8"
            />
            <Input 
              type="text" 
              value={plainColor} 
              onChange={(e) => handlePlainColorChange(e.target.value)}
            />
          </div>
          <div 
            className="h-8 rounded-md w-full"
            style={{
              backgroundColor: plainColor
            }}
          />
        </div>
      )}

      {backgroundType === "gradient" && (
        <>
          <div className="grid grid-cols-5 gap-2">
            {defaultGradients.map((bg) => (
              <button
                key={bg.name}
                className={`h-12 rounded-md border-2 transition-all ${
                  selectedBackground.name === bg.name
                    ? "border-primary scale-110 shadow-md"
                    : "border-transparent hover:scale-105"
                }`}
                title={bg.name}
                onClick={() => onSelectBackground(bg)}
                style={
                  bg.value === "transparent" 
                    ? { backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAKElEQVQYlWNgYGD4z4AEGIhUIHKKpoUCsApTQxwNKcXIUAElcxxTCgBnhgEhNLx1RQAAAABJRU5ErkJggg==', background-repeat: repeat" } 
                    : bg.value.includes(',') 
                      ? { background: `linear-gradient(to right, ${bg.value.split(',')[0]}, ${bg.value.split(',')[1]})` }
                      : { backgroundColor: bg.value }
                }
              />
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-12 border-dashed border-2"
                >
                  <Palette className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-3">
                  <h4 className="font-medium">Custom Gradient</h4>
                  <div className="space-y-2">
                    <Label>Start Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        value={color1} 
                        onChange={(e) => setColor1(e.target.value)}
                        className="w-12 p-1 h-8"
                      />
                      <Input 
                        type="text" 
                        value={color1} 
                        onChange={(e) => setColor1(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>End Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        value={color2} 
                        onChange={(e) => setColor2(e.target.value)}
                        className="w-12 p-1 h-8"
                      />
                      <Input 
                        type="text" 
                        value={color2} 
                        onChange={(e) => setColor2(e.target.value)}
                      />
                    </div>
                  </div>
                  <div 
                    className="h-8 rounded-md w-full"
                    style={{
                      background: `linear-gradient(to right, ${color1}, ${color2})`
                    }}
                  />
                  <Button 
                    className="w-full" 
                    onClick={handleCreateCustomGradient}
                  >
                    Apply Gradient
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}

      {backgroundType === "image" && (
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => backgroundImageInputRef?.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" /> Choose Background Image
          </Button>
          <Input
            ref={backgroundImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onBackgroundImageSelect}
          />
        </div>
      )}
    </div>
  );
};

export default GradientSelector;
