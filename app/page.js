"use client";
import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "fabric";
import { NavbarMinimal } from "@/components/NavbarMinimal";
import Settings from "@/components/Settings";
import PlayButton from "@/components/PlayButton";
import { Search, HelpCircle } from "lucide-react";
import { Button, Input } from "@mantine/core";

const Home = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  // Function to resize canvas dynamically with equal padding
  const resizeCanvas = (canvasInstance) => {
    if (!containerRef.current || !canvasInstance) return;

    const container = containerRef.current;
    const padding = 40; // Equal padding on all sides (matches p-10)
    const newWidth = container.clientWidth - padding * 2; // Padding on both sides
    const newHeight = container.clientHeight - padding * 2; // Padding top and bottom

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

      const handleResize = () => {
        resizeCanvas(initCanvas);
      };

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
    <div className="relative flex w-full h-screen overflow-hidden">
      <NavbarMinimal />
      <div className="w-full h-full flex flex-col">
        <div className="grid grid-cols-12 flex-1 h-[80%]">
          {/* Left controls - takes 4/12 columns */}
          <div className="col-span-4 p-4 flex flex-col gap-4 border-r border-gray-200">
            <Settings canvas={canvas} />
          </div>
          <div className="absolute top-0 z-10 right-2 w-[60%] pt-2">
            <div className="flex justify-between items-center">
              <div className="hover:bg-[#a3b1fd] hidden lg:flex">
                <Input
                  placeholder="Project Name"
                  className="hover:bg-[#a3b1fd]"
                />
              </div>
              <div className="flex justify-center items-center gap-2">
                <div className="hidden lg:flex items-center space-x-3 text-gray-700 text-sm">
                  <Search className="w-5 h-5" />
                  <HelpCircle className="w-5 h-5" />
                  <span>Save your project for later —</span>
                  <a href="/signup" className="text-blue-600 hover:underline">
                    sign up
                  </a>
                  <span>or</span>
                  <a href="/login" className="text-blue-600 hover:underline">
                    log in
                  </a>
                </div>
                <Button bg={"#ffa31d"} radius={"md"}>
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-[#f98115] flex items-center justify-center">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="overflow-visible"
                        style={{ strokeWidth: 4 }} // ✅ Fix: Use an object
                      >
                        <path
                          d="M9.255 7.2h3.45c.485 0 .786.448.541.803l-5.332 7.732c-.324.47-1.169.275-1.169-.27V8.8h-3.45c-.485 0-.786-.448-.541-.803L8.086.264c.324-.469 1.169-.274 1.169.27V7.2Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <div>Upgrade</div>
                  </div>
                </Button>
                <Button bg={"#5667f5"} radius={"md"}>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 16 16"
                      className="overflow-visible hidden lg:block" // ✅ Fixed class
                      style={{ strokeWidth: 1.5 }} // ✅ Fixed style syntax
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round" // ✅ JSX uses camelCase
                        strokeLinejoin="round" // ✅ JSX uses camelCase
                        d="m14 4-8 8-4-4"
                      ></path>
                    </svg>
                    <div>Done</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
          {/* Canvas area - takes 8/12 columns */}
          <div
            ref={containerRef}
            className="col-span-8 w-full h-full relative bg-[#f7f7f7]"
          >
            {/* This div provides equal padding on all sides */}
            <div className="absolute inset-10 flex items-center justify-center ">
              {" "}
              {/* Matches p-10 padding */}
              <canvas
                ref={canvasRef}
                id="canvas"
                className="w-full h-full mt-7"
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
        <div className="w-full h-[20%] border-t-2 border-black bg-amber-300 flex justify-center items-center">
          <PlayButton canvas={canvas} />
        </div>
      </div>
    </div>
  );
};

export default Home;
