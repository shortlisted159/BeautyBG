
import React, { useState } from "react";
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
import { Palette } from "lucide-react";

export type Background = {
  name: string;
  value: string;
  class: string;
};

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
  { name: "White", value: "#ffffff", class: "bg-white" },
  { name: "Black", value: "#000000", class: "bg-black" },
  { name: "None", value: "transparent", class: "bg-transparent-grid" },
];

interface GradientSelectorProps {
  selectedBackground: Background;
  onSelectBackground: (background: Background) => void;
}

const GradientSelector: React.FC<GradientSelectorProps> = ({ 
  selectedBackground,
  onSelectBackground
}) => {
  const [color1, setColor1] = useState("#ff758c");
  const [color2, setColor2] = useState("#ff7eb3");
  const [customGradients, setCustomGradients] = useState<Background[]>([]);
  const allGradients = [...defaultGradients, ...customGradients];
  
  const handleCreateCustomGradient = () => {
    const newCustomGradient: Background = {
      name: `Custom ${customGradients.length + 1}`,
      value: `${color1},${color2}`,
      class: `bg-gradient-to-r from-[${color1}] to-[${color2}]`
    };
    setCustomGradients([...customGradients, newCustomGradient]);
    onSelectBackground(newCustomGradient);
  };

  return (
    <div className="space-y-3">
      <Label>Background</Label>
      <div className="grid grid-cols-5 gap-2">
        {allGradients.map((bg) => (
          <button
            key={bg.name}
            className={`${bg.class} h-12 rounded-md border-2 transition-all ${
              selectedBackground.name === bg.name
                ? "border-primary scale-110 shadow-md"
                : "border-transparent hover:scale-105"
            }`}
            title={bg.name}
            onClick={() => onSelectBackground(bg)}
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
                Add Gradient
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default GradientSelector;
