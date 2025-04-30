
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SocialTemplate } from "@/types/SocialTemplates";
import { toast } from "sonner";

interface TemplatesTabProps {
  templates: SocialTemplate[];
  applyTemplate: (template: SocialTemplate) => void;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({ templates, applyTemplate }) => {
  const handleApplyTemplate = (template: SocialTemplate) => {
    applyTemplate(template);
    toast.success(`Applied ${template.name} template`);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Social Media Templates</Label>
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template) => (
            <Button
              key={template.name}
              variant="outline"
              size="sm"
              onClick={() => handleApplyTemplate(template)}
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
    </div>
  );
};

export default TemplatesTab;
