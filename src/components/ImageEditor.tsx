import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, ImagePlus, Download, Crop } from "lucide-react";
import GradientSelector, { Background, BackgroundType } from "./GradientSelector";
import { SocialTemplate, socialTemplates } from "@/types/SocialTemplates";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const backgrounds: Background[] = [
  { name: "Beach", value: "#00d2ff,#3a7bd5", class: "bg-gradient-beach" },
  { name: "Cool", value: "#accbee,#e7f0fd", class: "bg-gradient-cool" },
  { name: "Violet", value: "#7028e4,#e5b2ca", class: "bg-gradient-violet" },
  { name: "Rose", value: "#ee9ca7,#ffdde1", class: "bg-gradient-rose" },
  { name: "Love", value: "#ff758c,#ff7eb3", class: "bg-gradient-love" },
  { name: "Flower", value: "#a18cd1,#fbc2eb", class: "bg-gradient-flower" },
  { name: "Sky", value: "#89f7fe,#66a6ff", class: "bg-gradient-sky" },
  { name: "White", value: "#ffffff", class: "bg-white" },
  { name: "Black", value: "#000000", class: "bg-black" },
  { name: "None", value: "transparent", class: "bg-transparent-grid" },
];

const ratios = [
  { name: "Original", value: null },
  { name: "16:9", value: 16/9 },
  { name: "4:3", value: 4/3 },
  { name: "1:1", value: 1 },
  { name: "3:4", value: 3/4 },
  { name: "9:16", value: 9/16 },
];

type LogoPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-bottom";

const ImageEditor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [padding, setPadding] = useState<number>(48);
  const [borderRadius, setBorderRadius] = useState<number>(20);
  const [shadow, setShadow] = useState<number>(27);
  const [selectedBackground, setSelectedBackground] = useState<Background>(backgrounds[0]);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>("gradient");
  const [logoSize, setLogoSize] = useState<number>(50);
  const [logoPosition, setLogoPosition] = useState<LogoPosition>("bottom-right");
  const [selectedRatio, setSelectedRatio] = useState<{ name: string; value: number | null }>(ratios[0]);
  const [inset, setInset] = useState<boolean>(false);
  const [imageSize, setImageSize] = useState<number>(100); // Added for image size control (percentage)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Handle image upload via file input
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle background image upload
  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
        toast.success("Background image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
        toast.success("Logo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle paste for screenshots
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setImage(event.target?.result as string);
                toast.success("Image pasted successfully!");
              };
              reader.readAsDataURL(blob);
            }
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  // Handle export
  const handleExport = () => {
    if (!resultRef.current) return;

    html2canvas(resultRef.current, {
      backgroundColor: selectedBackground.value === "transparent" ? null : undefined,
      scale: 2,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "screenshot-sparkle.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Image exported successfully!");
    });
  };

  // Apply social media template
  const applyTemplate = (template: SocialTemplate) => {
    setPadding(template.padding);
    setBorderRadius(template.borderRadius);
    setShadow(template.shadow);
    setInset(template.inset);
    
    // Find matching ratio or keep current if not found
    if (template.aspectRatio !== null) {
      const matchingRatio = ratios.find(r => r.value === template.aspectRatio);
      if (matchingRatio) {
        setSelectedRatio(matchingRatio);
      } else {
        setSelectedRatio({ name: `Custom ${template.aspectRatio}`, value: template.aspectRatio });
      }
    }
    
    toast.success(`Applied ${template.name} template`);
  };

  // Get background style based on selected type
  const getBackgroundStyle = () => {
    if (backgroundType === "image" && backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      };
    } else if (backgroundType === "plain" || selectedBackground.class.startsWith('bg-[')) {
      return {
        backgroundColor: selectedBackground.value
      };
    } else if (selectedBackground.class.startsWith('bg-gradient-to-r')) {
      return {
        background: `linear-gradient(to right, ${selectedBackground.value.split(',')[0]}, ${selectedBackground.value.split(',')[1]})`
      };
    } else {
      return {};
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto p-4 md:p-6 animate-fade-in">
      <Card className="md:w-1/3 space-y-4">
        <CardContent className="pt-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
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
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
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
              
              <div className="space-y-2">
                <Label>Padding: {padding}px</Label>
                <Slider
                  value={[padding]}
                  min={0}
                  max={120}
                  step={4}
                  onValueChange={([value]) => setPadding(value)}
                />
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
                <input
                  type="checkbox"
                  id="inset-shadow"
                  checked={inset}
                  onChange={(e) => setInset(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="inset-shadow">Inset Shadow</Label>
              </div>
              
              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <div className="grid grid-cols-3 gap-2">
                  {ratios.map((ratio) => (
                    <Button
                      key={ratio.name}
                      variant={selectedRatio.name === ratio.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRatio(ratio)}
                      className="text-xs"
                    >
                      {ratio.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <GradientSelector 
                selectedBackground={selectedBackground} 
                onSelectBackground={setSelectedBackground}
                backgroundType={backgroundType}
                onBackgroundTypeChange={setBackgroundType}
                onBackgroundImageSelect={handleBgImageUpload}
                backgroundImageInputRef={bgImageInputRef}
              />
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="space-y-2">
                <Label>Social Media Templates</Label>
                <div className="grid grid-cols-2 gap-2">
                  {socialTemplates.map((template) => (
                    <Button
                      key={template.name}
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(template)}
                      className="text-xs h-10"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to apply preset settings for different platforms
                </p>
              </div>
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
      
      <div className="md:w-2/3 rounded-lg overflow-hidden flex items-center justify-center min-h-[500px] relative">
        {!image ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-muted rounded-lg text-center">
            <ImageIcon className="h-20 w-20 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Image Selected</h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-2">
              Upload an image or screenshot, or paste directly from your clipboard (Ctrl+V)
            </p>
          </div>
        ) : (
          <div 
            className="p-6 flex items-center justify-center w-full h-full overflow-auto"
            style={{ 
              minHeight: "500px",
              ...getBackgroundStyle()
            }}
          >
            <ContextMenu>
              <ContextMenuTrigger>
                <div 
                  ref={resultRef}
                  style={{ 
                    padding: `${padding}px`,
                    maxWidth: "100%",
                    position: "relative",
                    ...getBackgroundStyle()
                  }}
                >
                  {selectedRatio.value !== null ? (
                    <AspectRatio ratio={selectedRatio.value} className="relative">
                      <img
                        src={image}
                        alt="Uploaded screenshot"
                        className="w-full h-full object-cover"
                        style={{
                          borderRadius: `${borderRadius}px`,
                          boxShadow: inset 
                            ? `inset 0 ${shadow/3}px ${shadow}px rgba(0,0,0,${shadow/100})`
                            : `0 ${shadow/3}px ${shadow}px rgba(0,0,0,${shadow/100})`,
                          transform: `scale(${imageSize/100})`,
                          transformOrigin: "center center"
                        }}
                      />
                    </AspectRatio>
                  ) : (
                    <div className="relative">
                      <img
                        src={image}
                        alt="Uploaded screenshot"
                        className="w-full h-auto"
                        style={{
                          borderRadius: `${borderRadius}px`,
                          boxShadow: inset 
                            ? `inset 0 ${shadow/3}px ${shadow}px rgba(0,0,0,${shadow/100})`
                            : `0 ${shadow/3}px ${shadow}px rgba(0,0,0,${shadow/100})`,
                          transform: `scale(${imageSize/100})`,
                          transformOrigin: "center center"
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Logo placed in the padding area */}
                  {logo && (
                    <img 
                      src={logo} 
                      alt="Logo" 
                      className="absolute"
                      style={{ 
                        height: `${logoSize}px`,
                        width: "auto",
                        maxWidth: "50%",
                        objectFit: "contain",
                        top: logoPosition === "top-left" ? "0" : 
                             logoPosition === "top-right" ? "0" : 
                             "auto",
                        bottom: logoPosition === "bottom-left" || logoPosition === "bottom-right" || logoPosition === "center-bottom" ? "0" : "auto",
                        left: logoPosition === "top-left" || logoPosition === "bottom-left" ? "0" : 
                              logoPosition === "center-bottom" ? "50%" : "auto",
                        right: logoPosition === "top-right" || logoPosition === "bottom-right" ? "0" : "auto",
                        transform: logoPosition === "center-bottom" ? "translateX(-50%)" : "none"
                      }}
                    />
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => setImageSize(100)}>Reset Image Size</ContextMenuItem>
                <ContextMenuItem onClick={() => setImageSize(Math.min(imageSize + 10, 150))}>Increase Size</ContextMenuItem>
                <ContextMenuItem onClick={() => setImageSize(Math.max(imageSize - 10, 30))}>Decrease Size</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;
