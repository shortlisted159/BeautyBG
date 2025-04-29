import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Background } from "../GradientSelector";
import { SocialTemplate, socialTemplates } from "@/types/SocialTemplates";
import ImagePreview from "./ImagePreview";
import ControlPanel from "./ControlPanel";
import { BackgroundType } from "../GradientSelector";

// Define types
type LogoPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-bottom";

// Constants
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
  // State
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
  const [imageSize, setImageSize] = useState<number>(100);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  // Refs
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

    // @ts-ignore - html2canvas is loaded dynamically so TypeScript doesn't know about it
    html2canvas(resultRef.current, {
      backgroundColor: selectedBackground.value === "transparent" ? null : undefined,
      scale: 2,
    }).then((canvas: HTMLCanvasElement) => {
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
      <ControlPanel 
        image={image}
        imageInputRef={imageInputRef}
        logoInputRef={logoInputRef}
        bgImageInputRef={bgImageInputRef}
        handleImageUpload={handleImageUpload}
        handleLogoUpload={handleLogoUpload}
        handleBgImageUpload={handleBgImageUpload}
        handleExport={handleExport}
        logo={logo}
        logoSize={logoSize}
        setLogoSize={setLogoSize}
        logoPosition={logoPosition}
        setLogoPosition={setLogoPosition}
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
        socialTemplates={socialTemplates}
        applyTemplate={applyTemplate}
      />
      
      <div className="md:w-2/3 rounded-lg overflow-hidden flex items-center justify-center min-h-[500px] relative">
        <ImagePreview 
          image={image}
          logo={logo}
          padding={padding}
          borderRadius={borderRadius}
          shadow={shadow}
          inset={inset}
          selectedRatio={selectedRatio}
          logoSize={logoSize}
          logoPosition={logoPosition}
          imageSize={imageSize}
          backgroundStyle={getBackgroundStyle()}
          resultRef={resultRef}
          setImageSize={setImageSize}
        />
      </div>
    </div>
  );
};

export default ImageEditor;
