
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, ImagePlus } from "lucide-react";

type LogoPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-bottom";

interface UploadTabProps {
  imageInputRef: React.RefObject<HTMLInputElement>;
  logoInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logo: string | null;
  logoSize: number;
  setLogoSize: (size: number) => void;
  logoPosition: LogoPosition;
  setLogoPosition: (position: LogoPosition) => void;
}

const UploadTab: React.FC<UploadTabProps> = ({
  imageInputRef,
  logoInputRef,
  handleImageUpload,
  handleLogoUpload,
  logo,
  logoSize,
  setLogoSize,
  logoPosition,
  setLogoPosition,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Screenshot/Image</Label>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => imageInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" /> Choose Image
          </Button>
          <Input
            ref={imageInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <p className="text-xs text-muted-foreground text-center">
            or paste (Ctrl+V / Cmd+V) your screenshot directly
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Signature Logo (optional)</Label>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => logoInputRef.current?.click()}
          >
            <ImagePlus className="mr-2 h-4 w-4" /> Choose Logo
          </Button>
          <Input
            ref={logoInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
          />
        </div>
      </div>

      {logo && (
        <div className="space-y-2">
          <Label>Logo Size: {logoSize}px</Label>
          <Slider
            value={[logoSize]}
            min={20}
            max={200}
            step={1}
            onValueChange={([value]) => setLogoSize(value)}
          />

          <Label className="mt-2">Logo Position</Label>
          <div className="grid grid-cols-1 gap-2">
            <Select
              value={logoPosition}
              onValueChange={(value) => setLogoPosition(value as LogoPosition)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top-left">Top Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="center-bottom">Bottom Center</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadTab;
