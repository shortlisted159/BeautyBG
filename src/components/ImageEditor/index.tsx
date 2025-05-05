
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Background } from "../GradientSelector";
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

const ImageEditor = () => {
  // State
  const [image, setImage] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [padding, setPadding] = useState<number>(48);
  const [showPadding, setShowPadding] = useState<boolean>(true);
  const [borderRadius, setBorderRadius] = useState<number>(20);
  const [shadow, setShadow] = useState<number>(27);
  const [selectedBackground, setSelectedBackground] = useState<Background>(backgrounds[0]);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>("gradient");
  const [logoSize, setLogoSize] = useState<number>(50);
  const [logoPosition, setLogoPosition] = useState<LogoPosition>("bottom-right");
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
        setBackgroundType("image");
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
    if (!resultRef.current || !image) {
      toast.error("No image to export");
      return;
    }

    // @ts-ignore - html2canvas is loaded dynamically so TypeScript doesn't know about it
    if (typeof window.html2canvas === 'function') {
      // Create a temporary container for export
      const exportContainer = document.createElement("div");
      exportContainer.style.position = "fixed";
      exportContainer.style.top = "-9999px";
      exportContainer.style.left = "-9999px";
      document.body.appendChild(exportContainer);
      
      // Create the container that will match our preview
      const previewContainer = document.createElement("div");
      previewContainer.style.position = "relative";
      
      // Only apply padding if showPadding is true
      if (showPadding) {
        previewContainer.style.padding = `${padding}px`;
      }
      
      // Apply correct background based on type
      if (backgroundType === "image" && backgroundImage) {
        previewContainer.style.backgroundImage = `url(${backgroundImage})`;
        previewContainer.style.backgroundSize = "cover";
        previewContainer.style.backgroundPosition = "center";
      } else if (backgroundType === "plain") {
        const color = selectedBackground.value.includes(',') ? 
          selectedBackground.value.split(',')[0] : selectedBackground.value;
        previewContainer.style.backgroundColor = color;
      } else if (backgroundType === "gradient") {
        if (selectedBackground.value.includes(',')) {
          const colors = selectedBackground.value.split(',');
          previewContainer.style.background = `linear-gradient(to right, ${colors[0]}, ${colors[1]})`;
        } else {
          previewContainer.style.backgroundColor = selectedBackground.value;
        }
      }
      
      // Create and style the image element
      const imgElement = document.createElement("img");
      imgElement.src = image;
      imgElement.style.width = "100%";
      imgElement.style.height = "auto";
      imgElement.style.objectFit = "contain";
      imgElement.style.borderRadius = `${borderRadius}px`;
      imgElement.style.boxShadow = inset 
        ? `inset 0 ${shadow / 3}px ${shadow}px rgba(0,0,0,${shadow / 100})` 
        : `0 ${shadow / 3}px ${shadow}px rgba(0,0,0,${shadow / 100})`;
      imgElement.style.transform = `scale(${imageSize / 100})`;
      imgElement.style.transformOrigin = "center center";
      
      previewContainer.appendChild(imgElement);
      
      // Add logo if present and padding is shown
      if (logo && showPadding) {
        const logoImg = document.createElement("img");
        logoImg.src = logo;
        logoImg.style.position = "absolute";
        logoImg.style.height = `${logoSize}px`;
        logoImg.style.width = "auto";
        logoImg.style.maxWidth = "50%";
        logoImg.style.objectFit = "contain";
        
        // Position the logo
        if (logoPosition === "top-left") {
          logoImg.style.top = "0";
          logoImg.style.left = "0";
        } else if (logoPosition === "top-right") {
          logoImg.style.top = "0";
          logoImg.style.right = "0";
        } else if (logoPosition === "bottom-left") {
          logoImg.style.bottom = "0";
          logoImg.style.left = "0";
        } else if (logoPosition === "bottom-right") {
          logoImg.style.bottom = "0";
          logoImg.style.right = "0";
        } else if (logoPosition === "center-bottom") {
          logoImg.style.bottom = "0";
          logoImg.style.left = "50%";
          logoImg.style.transform = "translateX(-50%)";
        }
        
        previewContainer.appendChild(logoImg);
      }
      
      // Add the container to the DOM temporarily for html2canvas to work with
      exportContainer.appendChild(previewContainer);
      
      // Use html2canvas to generate the final image
      // @ts-ignore
      window.html2canvas(previewContainer, {
        backgroundColor: selectedBackground.value === "transparent" ? null : undefined,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
      }).then((canvas: HTMLCanvasElement) => {
        // Create download link
        const link = document.createElement("a");
        link.download = "screenshot-sparkle.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        // Clean up
        document.body.removeChild(exportContainer);
        toast.success("Image exported successfully!");
      }).catch((error: any) => {
        console.error("Export error:", error);
        toast.error("Failed to export image");
        document.body.removeChild(exportContainer);
      });
    } else {
      toast.error("Export functionality is not available. Please try again later.");
    }
  };

  // Get background style based on selected type
  const getBackgroundStyle = () => {
    if (backgroundType === "image" && backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      };
    } else if (backgroundType === "plain") {
      return {
        backgroundColor: selectedBackground.value.includes(',') ? 
          selectedBackground.value.split(',')[0] : selectedBackground.value
      };
    } else if (backgroundType === "gradient") {
      // Handle gradient backgrounds
      if (selectedBackground.value.includes(',')) {
        const colors = selectedBackground.value.split(',');
        return {
          background: `linear-gradient(to right, ${colors[0]}, ${colors[1]})`
        };
      } else {
        return {
          backgroundColor: selectedBackground.value
        };
      }
    }
    return {};
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
        showPadding={showPadding}
        setShowPadding={setShowPadding}
        borderRadius={borderRadius}
        setBorderRadius={setBorderRadius}
        shadow={shadow}
        setShadow={setShadow}
        inset={inset}
        setInset={setInset}
        selectedBackground={selectedBackground}
        setSelectedBackground={setSelectedBackground}
        backgroundType={backgroundType}
        setBackgroundType={setBackgroundType}
      />
      
      <div className="md:w-2/3 rounded-lg overflow-hidden flex items-center justify-center min-h-[500px] bg-gray-50">
        <ImagePreview 
          image={image}
          logo={logo}
          padding={padding}
          showPadding={showPadding}
          borderRadius={borderRadius}
          shadow={shadow}
          inset={inset}
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
