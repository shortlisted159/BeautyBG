
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type LogoPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-bottom";

interface ImagePreviewProps {
  image: string | null;
  logo: string | null;
  padding: number;
  borderRadius: number;
  shadow: number;
  inset: boolean;
  selectedRatio: { name: string; value: number | null };
  logoSize: number;
  logoPosition: LogoPosition;
  imageSize: number;
  backgroundStyle: React.CSSProperties;
  resultRef: React.RefObject<HTMLDivElement>;
  setImageSize: (size: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  logo,
  padding,
  borderRadius,
  shadow,
  inset,
  selectedRatio,
  logoSize,
  logoPosition,
  imageSize,
  backgroundStyle,
  resultRef,
  setImageSize,
}) => {
  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-muted rounded-lg text-center">
        <div className="h-20 w-20 text-muted-foreground mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">No Image Selected</h3>
        <p className="text-sm text-muted-foreground max-w-xs mt-2">
          Upload an image or screenshot, or paste directly from your clipboard (Ctrl+V)
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-6 flex items-center justify-center w-full h-full overflow-auto"
      style={{
        minHeight: "500px",
        ...backgroundStyle,
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
              ...backgroundStyle,
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
                      ? `inset 0 ${shadow / 3}px ${shadow}px rgba(0,0,0,${shadow / 100})`
                      : `0 ${shadow / 3}px ${shadow}px rgba(0,0,0,${shadow / 100})`,
                    transform: `scale(${imageSize / 100})`,
                    transformOrigin: "center center",
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
                      ? `inset 0 ${shadow / 3}px ${shadow}px rgba(0,0,0,${shadow / 100})`
                      : `0 ${shadow / 3}px ${shadow}px rgba(0,0,0,${shadow / 100})`,
                    transform: `scale(${imageSize / 100})`,
                    transformOrigin: "center center",
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
          <ContextMenuItem onClick={() => setImageSize(Math.min(imageSize + 10, 150))}>
            Increase Size
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setImageSize(Math.max(imageSize - 10, 30))}>
            Decrease Size
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default ImagePreview;
