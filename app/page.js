"use client";
import React from "react";
import { Canvas } from "fabric";
import { Image } from "fabric";
import { useState, useRef, useEffect } from "react";
import Settings from "@/components/settings";
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
  function fileHandler(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const image = await Image.fromURL(e.target.result);
      image.scale(0.5);
      canvas.add(image);
      canvas.centerObject(image);
      canvas.setActiveObject(image);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }
  return (
    <div className="flex flex-col items-center justify-center w-[100vw] h-[100vh] bg-gray-100">
      <canvas ref={canvasRef} id="canvas" width="500" height="500"></canvas>
      <button title="Add image">
        <input type="file" accept=".png, .jpg, .jpeg" onChange={fileHandler} />
      </button>
      <Settings canvas={canvas} />
      <Video canvas={canvas} canvasRef={canvasRef} />
    </div>
  );
};

export default Home;
