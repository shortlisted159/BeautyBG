
import React from "react";

const Header = () => {
  return (
    <header className="py-6 border-b">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <h1 className="text-xl font-bold">Screenshot Sparkle Factory</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Create beautiful screenshot images
        </div>
      </div>
    </header>
  );
};

export default Header;
