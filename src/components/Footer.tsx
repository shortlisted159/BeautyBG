
import React from "react";

const Footer = () => {
  return (
    <footer className="py-6 border-t mt-8">
      <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <div>
          Screenshot Sparkle Factory &copy; {new Date().getFullYear()}
        </div>
        <div className="mt-2 md:mt-0">
          Made with ❤️ for beautiful screenshots
        </div>
      </div>
    </footer>
  );
};

export default Footer;
