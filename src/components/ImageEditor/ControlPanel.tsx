
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import UploadTab from "./UploadTab";
import SettingsTab from "./SettingsTab";
import TemplatesTab from "./TemplatesTab";
import { Background, BackgroundType } from "../GradientSelector";
import { SocialTemplate } from "@/types/SocialTemplates";

type LogoPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-bottom";

interface ControlPanelProps {
  image: string | null;
  imageInputRef: React.RefObject<HTMLInputElement>;
  logoInputRef: React.RefObject<HTMLInputElement>;
  bgImageInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBgImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExport: () => void;
  logo: string | null;
  logoSize: number;
  setLogoSize: (size: number) => void;
  logoPosition: LogoPosition;
  setLogoPosition: (position: LogoPosition) => void;
  imageSize: number;
  setImageSize: (size: number) => void;
  padding: number;
  setPadding: (padding: number) => void;
  borderRadius: number;
  setBorderRadius: (borderRadius: number) => void;
  shadow: number;
  setShadow: (shadow: number) => void;
  inset: boolean;
  setInset: (inset: boolean) => void;
  selectedRatio: { name: string; value: number | null };
  setSelectedRatio: (ratio: { name: string; value: number | null }) => void;
  ratios: { name: string; value: number | null }[];
  selectedBackground: Background;
  setSelectedBackground: (background: Background) => void;
  backgroundType: BackgroundType;
  setBackgroundType: (type: BackgroundType) => void;
  socialTemplates: SocialTemplate[];
  applyTemplate: (template: SocialTemplate) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  image,
  imageInputRef,
  logoInputRef,
  bgImageInputRef,
  handleImageUpload,
  handleLogoUpload,
  handleBgImageUpload,
  handleExport,
  logo,
  logoSize,
  setLogoSize,
  logoPosition,
  setLogoPosition,
  imageSize,
  setImageSize,
  padding,
  setPadding,
  borderRadius,
  setBorderRadius,
  shadow,
  setShadow,
  inset,
  setInset,
  selectedRatio,
  setSelectedRatio,
  ratios,
  selectedBackground,
  setSelectedBackground,
  backgroundType,
  setBackgroundType,
  socialTemplates,
  applyTemplate,
}) => {
  return (
    <Card className="md:w-1/3 space-y-4">
      <CardContent className="pt-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <UploadTab
              imageInputRef={imageInputRef}
              logoInputRef={logoInputRef}
              handleImageUpload={handleImageUpload}
              handleLogoUpload={handleLogoUpload}
              logo={logo}
              logoSize={logoSize}
              setLogoSize={setLogoSize}
              logoPosition={logoPosition}
              setLogoPosition={setLogoPosition}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab
              image={image}
              imageSize={imageSize}
              setImageSize={setImageSize}
              padding={padding}
              setPadding={setPadding}
              borderRadius={borderRadius}
              setBorderRadius={setBorderRadius}
              shadow={shadow}
              setShadow={setShadow}
              inset={inset}
              setInset={setInset}
              selectedRatio={selectedRatio}
              setSelectedRatio={setSelectedRatio}
              ratios={ratios}
              selectedBackground={selectedBackground}
              setSelectedBackground={setSelectedBackground}
              backgroundType={backgroundType}
              setBackgroundType={setBackgroundType}
              handleBgImageUpload={handleBgImageUpload}
              bgImageInputRef={bgImageInputRef}
            />
          </TabsContent>

          <TabsContent value="templates">
            <TemplatesTab templates={socialTemplates} applyTemplate={applyTemplate} />
          </TabsContent>
        </Tabs>

        <Button
          className="w-full mt-4"
          disabled={!image}
          onClick={handleExport}
        >
          <Download className="mr-2 h-4 w-4" /> Export Image
        </Button>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
