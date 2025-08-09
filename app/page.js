"use client";
import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "fabric";
import { NavbarMinimal } from "@/components/NavbarMinimal";
import Settings from "@/components/Settings";
import PlayButton from "@/components/PlayButton";
import { Search, HelpCircle, Menu } from "lucide-react";
import { Button, Input, Drawer } from "@mantine/core";

const Home = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Function to resize canvas dynamically with equal padding
  const resizeCanvas = (canvasInstance) => {
    if (!containerRef.current || !canvasInstance) return;

    const container = containerRef.current;
    const padding = isMobile ? 20 : 40; // Smaller padding on mobile
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
  }, [isMobile]);

  return (
    <div className="relative flex w-full h-screen overflow-hidden">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          className="absolute top-2 left-2 z-50 p-2 bg-white rounded-md shadow-md"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar - hidden on mobile unless menu is open */}
      <div
        className={`${
          isMobile
            ? "fixed inset-0 z-40 transform transition-transform duration-300"
            : "static"
        } 
                      ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
                      ${!isMobile && "translate-x-0"}`}
      >
        <NavbarMinimal onClose={() => setMobileMenuOpen(false)} />
      </div>

      {/* Overlay for mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="w-full h-full flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 h-[80%]">
          {/* Left controls - full width on mobile, 4/12 on desktop */}
          <div
            className={`${
              isMobile ? "hidden" : "col-span-4"
            } p-4 flex flex-col gap-4 border-r border-gray-200`}
          >
            <Settings canvas={canvas} />
          </div>

          {/* Mobile settings drawer */}
          <Drawer
            opened={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            title="Settings"
            position="left"
            size="80%"
            className="md:hidden"
          >
            <Settings canvas={canvas} />
          </Drawer>

          {/* Header area - simplified for mobile */}
          <div
            className={`absolute top-0 z-10 ${
              isMobile ? "left-0 right-0 px-2" : "right-2 w-[60%]"
            } pt-2`}
          >
            <div className="flex justify-between items-center">
              {!isMobile && (
                <div className="hover:bg-[#a3b1fd] hidden lg:flex">
                  <Input
                    placeholder="Project Name"
                    className="hover:bg-[#a3b1fd]"
                  />
                </div>
              )}

              <div className="flex justify-center items-center gap-2 ml-auto">
                {!isMobile && (
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
                )}

                <Button
                  bg={"#ffa31d"}
                  radius={"md"}
                  size={isMobile ? "sm" : "md"}
                  className="text-xs md:text-base"
                >
                  <div className="flex justify-center items-center gap-1 md:gap-2">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-sm bg-[#f98115] flex items-center justify-center">
                      <svg
                        width={isMobile ? 8 : 10}
                        height={isMobile ? 8 : 10}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="overflow-visible"
                        style={{ strokeWidth: 4 }}
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

                <Button
                  bg={"#5667f5"}
                  radius={"md"}
                  size={isMobile ? "sm" : "md"}
                  className="text-xs md:text-base"
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    {!isMobile && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 16 16"
                        className="overflow-visible hidden lg:block"
                        style={{ strokeWidth: 1.5 }}
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14 4-8 8-4-4"
                        ></path>
                      </svg>
                    )}
                    <div>Done</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas area - full width on mobile, 8/12 on desktop */}
          <div
            ref={containerRef}
            className={`${
              isMobile ? "col-span-1" : "col-span-8"
            } w-full h-full relative bg-[#f7f7f7]`}
          >
            {/* This div provides equal padding on all sides */}
            <div
              className={`absolute ${
                isMobile ? "inset-5" : "inset-10"
              } flex items-center justify-center`}
            >
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

        {/* Bottom Play Button - smaller on mobile */}
        <div className="w-full h-[20%] md:h-[25%] border-t-2 border-black relative">
          <PlayButton canvas={canvas} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
};

export default Home;
