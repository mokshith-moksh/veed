"use client";
import React from "react";
import { Canvas } from "fabric";

import { useState, useRef, useEffect } from "react";
import Settings from "@/components/Settings";
import PlayButton from "@/components/PlayButton";
import Video from "@/components/Video";

const Home = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const intiCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
      });
      intiCanvas.backgroundColor = "#fff";
      intiCanvas.renderAll();
      setCanvas(intiCanvas);
      return () => {
        intiCanvas.dispose();
      };
    }

    setCanvas(canvas);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-[100vw] h-[100vh] bg-gray-100">
      <canvas ref={canvasRef} id="canvas" width="500" height="500"></canvas>
      <Video canvas={canvas} />
      <Settings canvas={canvas} />
      <PlayButton canvas={canvas} />
    </div>
  );
};

export default Home;
