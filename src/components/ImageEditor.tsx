
import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, ImagePlus, Download, Crop } from "lucide-react";

type Background = {
  name: string;
  value: string;
  class: string;
};

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

const ImageEditor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [padding, setPadding] = useState<number>(48);
  const [borderRadius, setBorderRadius] = useState<number>(20);
  const [shadow, setShadow] = useState<number>(27);
  const [selectedBackground, setSelectedBackground] = useState<Background>(backgrounds[0]);
  const [logoSize, setLogoSize] = useState<number>(50);
  const [logoPosition, setLogoPosition] = useState<"bottom-right" | "bottom-left" | "top-right" | "top-left" | "center-bottom">("bottom-right");
  const [selectedRatio, setSelectedRatio] = useState<{ name: string; value: number | null }>(ratios[0]);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
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

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto p-4 md:p-6 animate-fade-in">
      <Card className="md:w-1/3 space-y-4">
        <CardContent className="pt-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
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
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={logoPosition === "top-left" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLogoPosition("top-left")}
                      className="text-xs"
                    >
                      Top Left
                    </Button>
                    <div />
                    <Button
                      variant={logoPosition === "top-right" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLogoPosition("top-right")}
                      className="text-xs"
                    >
                      Top Right
                    </Button>
                    <div />
                    <Button
                      variant={logoPosition === "center-bottom" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLogoPosition("center-bottom")}
                      className="text-xs"
                    >
                      Bottom
                    </Button>
                    <div />
                    <Button
                      variant={logoPosition === "bottom-left" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLogoPosition("bottom-left")}
                      className="text-xs"
                    >
                      Bottom Left
                    </Button>
                    <div />
                    <Button
                      variant={logoPosition === "bottom-right" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLogoPosition("bottom-right")}
                      className="text-xs"
                    >
                      Bottom Right
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
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
              
              <div className="space-y-2">
                <Label>Background</Label>
                <div className="grid grid-cols-5 gap-2">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.name}
                      className={`${bg.class} h-12 rounded-md border-2 transition-all ${
                        selectedBackground.name === bg.name
                          ? "border-primary scale-110 shadow-md"
                          : "border-transparent hover:scale-105"
                      }`}
                      title={bg.name}
                      onClick={() => setSelectedBackground(bg)}
                    />
                  ))}
                </div>
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
            className={`${selectedBackground.class} p-6 flex items-center justify-center w-full h-full overflow-auto`}
            style={{ 
              minHeight: "500px", 
            }}
          >
            <div 
              ref={resultRef}
              className={`${selectedBackground.class} p-${padding} relative`}
              style={{ 
                padding: `${padding}px`,
                maxWidth: "100%"
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
                      boxShadow: shadow > 0 ? `0 ${shadow/3}px ${shadow}px rgba(0,0,0,${shadow/100})` : "none",
                    }}
                  />
                  {logo && (
                    <img 
                      src={logo} 
                      alt="Logo" 
                      className={`absolute ${
                        logoPosition === "top-left" ? "top-2 left-2" :
                        logoPosition === "top-right" ? "top-2 right-2" :
                        logoPosition === "center-bottom" ? "bottom-2 left-1/2 -translate-x-1/2" :
                        logoPosition === "bottom-left" ? "bottom-2 left-2" :
                        "bottom-2 right-2"
                      }`}
                      style={{ 
                        height: `${logoSize}px`,
                        width: "auto",
                        maxWidth: "50%",
                        objectFit: "contain"
                      }}
                    />
                  )}
                </AspectRatio>
              ) : (
                <div className="relative">
                  <img
                    src={image}
                    alt="Uploaded screenshot"
                    className="w-full h-auto"
                    style={{
                      borderRadius: `${borderRadius}px`,
                      boxShadow: shadow > 0 ? `0 ${shadow/3}px ${shadow}px rgba(0,0,0,${shadow/100})` : "none",
                    }}
                  />
                  {logo && (
                    <img 
                      src={logo} 
                      alt="Logo" 
                      className={`absolute ${
                        logoPosition === "top-left" ? "top-2 left-2" :
                        logoPosition === "top-right" ? "top-2 right-2" :
                        logoPosition === "center-bottom" ? "bottom-2 left-1/2 -translate-x-1/2" :
                        logoPosition === "bottom-left" ? "bottom-2 left-2" :
                        "bottom-2 right-2"
                      }`}
                      style={{ 
                        height: `${logoSize}px`,
                        width: "auto",
                        maxWidth: "50%",
                        objectFit: "contain"
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;
