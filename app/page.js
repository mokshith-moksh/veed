"use client";
import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "fabric";
import Settings from "@/components/Settings";
import PlayButton from "@/components/PlayButton";
import { Search, HelpCircle } from "lucide-react";
import { Button, Input } from "@mantine/core";

const Home = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  const resizeCanvas = (canvasInstance) => {
    if (!containerRef.current || !canvasInstance) return;

    const container = containerRef.current;
    const padding = window.innerWidth < 768 ? 20 : 40;
    const newWidth = container.clientWidth - padding * 2;
    const newHeight = container.clientHeight - padding * 2;

    canvasInstance.setWidth(newWidth);
    canvasInstance.setHeight(newHeight);
    canvasInstance.renderAll();
  };

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        backgroundColor: "#000000",
        preserveObjectStacking: true,
      });

      setCanvas(initCanvas);
      resizeCanvas(initCanvas);

      const handleResize = () => resizeCanvas(initCanvas);
      const resizeObserver = new ResizeObserver(handleResize);

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
        initCanvas.dispose();
      };
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* Main content area */}
      <div className="flex flex-col md:flex-row flex-1 h-[80%]">
        {/* Settings panel */}
        <div className="w-full md:w-1/3 p-2 md:p-4 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto h-[40%] md:h-full">
          <Settings canvas={canvas} />
        </div>

        {/* Canvas area */}
        <div
          ref={containerRef}
          className="flex-1 relative bg-white h-[60%] md:h-full"
        >
          {/* Canvas */}
          <div className="absolute inset-2 md:inset-10 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              id="canvas"
              className="w-full h-full mt-0 md:mt-7"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Play Button */}
      <div className="w-full h-[20%] md:h-[25%] border-t-2 border-black relative">
        <PlayButton canvas={canvas} />
      </div>
    </div>
  );
};

export default Home;
