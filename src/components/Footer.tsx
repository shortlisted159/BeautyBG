
import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const Footer = () => {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="py-6 border-t mt-8">
      <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Screenshot Sparkle Factory &copy; {new Date().getFullYear()}</span>
          <span className="hidden md:inline">|</span>
          <span>Made by Sanjukta Singha</span>
        </div>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <span>Made with ❤️ for beautiful screenshots</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
