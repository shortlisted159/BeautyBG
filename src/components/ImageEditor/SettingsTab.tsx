
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import GradientSelector, { Background, BackgroundType } from "../GradientSelector";

interface SettingsTabProps {
  image: string | null;
  imageSize: number;
  setImageSize: (size: number) => void;
  padding: number;
  setPadding: (padding: number) => void;
  showPadding: boolean;
  setShowPadding: (show: boolean) => void;
  borderRadius: number;
  setBorderRadius: (borderRadius: number) => void;
  shadow: number;
  setShadow: (shadow: number) => void;
  inset: boolean;
  setInset: (inset: boolean) => void;
  selectedBackground: Background;
  setSelectedBackground: (background: Background) => void;
  backgroundType: BackgroundType;
  setBackgroundType: (type: BackgroundType) => void;
  handleBgImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bgImageInputRef: React.RefObject<HTMLInputElement>;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  image,
  imageSize,
  setImageSize,
  padding,
  setPadding,
  showPadding,
  setShowPadding,
  borderRadius,
  setBorderRadius,
  shadow,
  setShadow,
  inset,
  setInset,
  selectedBackground,
  setSelectedBackground,
  backgroundType,
  setBackgroundType,
  handleBgImageUpload,
  bgImageInputRef,
}) => {
  return (
    <div className="space-y-4">
      {image && (
        <div className="space-y-2">
          <Label>Image Size: {imageSize}%</Label>
          <Slider
            value={[imageSize]}
            min={30}
            max={150}
            step={1}
            onValueChange={([value]) => setImageSize(value)}
          />
        </div>
      )}

      <div className="space-y-2 mb-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-padding">Padding</Label>
          <Switch 
            id="show-padding"
            checked={showPadding}
            onCheckedChange={(checked) => setShowPadding(checked)}
          />
        </div>
        {showPadding && (
          <>
            <Label className="text-xs text-muted-foreground">Padding size: {padding}px</Label>
            <Slider
              value={[padding]}
              min={0}
              max={120}
              step={4}
              onValueChange={([value]) => setPadding(value)}
            />
          </>
        )}
      </div>

      <div className="space-y-2">
        <Label>Border Radius: {borderRadius}px</Label>
        <Slider
          value={[borderRadius]}
          min={0}
          max={60}
          step={1}
          onValueChange={([value]) => setBorderRadius(value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Shadow: {shadow}</Label>
        <Slider
          value={[shadow]}
          min={0}
          max={50}
          step={1}
          onValueChange={([value]) => setShadow(value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="inset-shadow"
          checked={inset}
          onCheckedChange={setInset}
        />
        <Label htmlFor="inset-shadow">Inset Shadow</Label>
      </div>

      <GradientSelector
        selectedBackground={selectedBackground}
        onSelectBackground={setSelectedBackground}
        backgroundType={backgroundType}
        onBackgroundTypeChange={setBackgroundType}
        onBackgroundImageSelect={handleBgImageUpload}
        backgroundImageInputRef={bgImageInputRef}
      />
    </div>
  );
};

export default SettingsTab;
