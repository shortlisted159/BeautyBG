
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SocialTemplate } from "@/types/SocialTemplates";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface TemplatesTabProps {
  templates: SocialTemplate[];
  applyTemplate: (template: SocialTemplate) => void;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({ templates, applyTemplate }) => {
  const handleApplyTemplate = (template: SocialTemplate) => {
    try {
      applyTemplate(template);
      toast.success(`Applied ${template.name} template`);
    } catch (error) {
      console.error("Error applying template:", error);
      toast.error("Failed to apply template");
    }
  };

  // Helper function to display aspect ratio in readable format
  const formatAspectRatio = (ratio: number | null) => {
    if (ratio === null) return 'Original';
    if (ratio === 1) return '1:1';
    if (ratio > 1) return `${Math.round(ratio*10)/10}:1`;
    return `1:${Math.round(10/ratio)/10}`;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Social Media Templates</Label>
        <div className="grid grid-cols-2 gap-3">
          {templates.map((template) => (
            <Card 
              key={template.name}
              className="p-2 cursor-pointer hover:bg-secondary/10 hover:border-primary transition-colors"
              onClick={() => handleApplyTemplate(template)}
            >
              <div className="text-center mb-1 font-medium text-sm">{template.name}</div>
              <div 
                className="bg-gray-100 rounded-md h-16 flex items-center justify-center text-xs text-gray-500"
              >
                <div className="text-center">
                  <div>{formatAspectRatio(template.aspectRatio)}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {template.shadow > 0 ? 'Shadow' : 'No Shadow'} • {template.borderRadius}px radius
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Click to apply preset settings for different platforms
        </p>
      </div>
    </div>
  );
};

export default TemplatesTab;
