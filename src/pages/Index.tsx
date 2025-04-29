
import React from "react";
import Header from "@/components/Header";
import ImageEditor from "@/components/ImageEditor";
import Footer from "@/components/Footer";
import { toast } from "sonner";

// Load html2canvas library for screenshot export
const loadHtml2Canvas = () => {
  const script = document.createElement("script");
  script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
  script.async = true;
  document.body.appendChild(script);

  return new Promise<void>((resolve, reject) => {
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load html2canvas"));
  });
};

const Index = () => {
  React.useEffect(() => {
    loadHtml2Canvas()
      .then(() => {
        console.log("html2canvas loaded successfully");
      })
      .catch((error) => {
        console.error("Error loading html2canvas:", error);
        toast.error("Failed to load export functionality");
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <section className="mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Transform Your Screenshots
            </h2>
            <p className="text-muted-foreground">
              Upload any image or screenshot, add beautiful backgrounds, adjust borders and padding,
              and add your logo as a signature. No account required - your images never leave your browser.
            </p>
          </section>
          
          <ImageEditor />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
