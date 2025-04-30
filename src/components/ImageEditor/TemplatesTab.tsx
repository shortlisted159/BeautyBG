
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Social Media Templates</Label>
        <div className="grid grid-cols-2 gap-3">
          {templates.map((template) => (
            <Card 
              key={template.name}
              className="p-2 cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleApplyTemplate(template)}
            >
              <div className="text-center mb-1 font-medium text-sm">{template.name}</div>
              <div 
                className="bg-gray-100 rounded-md h-16 flex items-center justify-center text-xs text-gray-500"
                style={{
                  borderRadius: `${template.borderRadius/2}px`,
                  boxShadow: template.shadow > 0 ? `0 ${template.shadow/4}px ${template.shadow/2}px rgba(0,0,0,0.1)` : 'none'
                }}
              >
                {template.aspectRatio ? 
                  `${template.aspectRatio === 1 ? '1:1' : template.aspectRatio > 1 ? 
                  `${Math.round(template.aspectRatio*10)/10}:1` : 
                  `1:${Math.round(10/template.aspectRatio)/10}`}` 
                  : 'Original'}
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
