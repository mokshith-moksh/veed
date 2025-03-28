"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Square } from "lucide-react";
import Video from "@/components/Video";
const Settings = ({ canvas }) => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [originalDimensions, setOriginalDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!canvas) return;

    const handleSelectionCreated = (e) => handleObjectSelection(e.selected[0]);
    const handleSelectionUpdated = (e) => handleObjectSelection(e.selected[0]);
    const handleSelectionCleared = () => {
      handleObjectSelection(null);
      setSelectedObject(null);
      clearSettings();
    };
    const handleObjectModified = (e) => handleObjectSelection(e.target);
    const handleObjectScaling = (e) => handleObjectSelection(e.target);

    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionUpdated);
    canvas.on("selection:cleared", handleSelectionCleared);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:scaling", handleObjectScaling);

    return () => {
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionUpdated);
      canvas.off("selection:cleared", handleSelectionCleared);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("object:scaling", handleObjectScaling);
    };
  }, [canvas]);

  const handleObjectSelection = (object) => {
    if (!object) return;

    setSelectedObject(object);

    // Calculate scaled dimensions
    const scaledWidth = Math.round(object.width * object.scaleX);
    const scaledHeight = Math.round(object.height * object.scaleY);
    setWidth(scaledWidth);
    setHeight(scaledHeight);

    // Store original dimensions when first selected
    if (originalDimensions.width === 0 && originalDimensions.height === 0) {
      setOriginalDimensions({
        width: object.width,
        height: object.height,
      });
    }

    // 🔹 Ensure `startTime` updates from the newly selected object
    setStartTime(
      object.startTime !== undefined ? Math.round(object.startTime) : ""
    );
    setEndTime(object.endTime !== undefined ? Math.round(object.endTime) : "");
  };

  const clearSettings = () => {
    setWidth(0);
    setHeight(0);
    setOriginalDimensions({ width: 0, height: 0 });
  };

  const handleWidthChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) return;

    setWidth(intValue);

    if (selectedObject && intValue > 0) {
      const scaleX = intValue / originalDimensions.width;
      selectedObject.set({
        scaleX: scaleX,
        scaleY: scaleX, // maintain aspect ratio
      });
      canvas.requestRenderAll();
    }
  };

  const handleHeightChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) return;

    setHeight(intValue);

    if (selectedObject && intValue > 0) {
      const scaleY = intValue / originalDimensions.height;
      selectedObject.set({
        scaleY: scaleY,
        scaleX: scaleY, // maintain aspect ratio
      });
      canvas.requestRenderAll();
    }
  };

  const handleStartChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
      setStartTime("");
      return;
    }
    console.log("intValue", intValue);
    if (selectedObject && intValue >= 0 && intValue <= 100) {
      selectedObject.startTime = intValue;
      setStartTime(value);
      canvas.requestRenderAll();
    }
  };

  const handleEndChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
      setEndTime("");
      return;
    }
    console.log("intValue", intValue);
    if (selectedObject && intValue >= 0 && intValue <= 100) {
      selectedObject.endTime = intValue;
      setEndTime(value);
      canvas.requestRenderAll();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
      <div className="mt-2 w-full max-w-2xl">
        <Video canvas={canvas} />
      </div>

      {selectedObject && (
        <div className="flex flex-col items-center w-full max-w-md space-y-4">
          {/* Dimensions Control */}
          <div className="flex items-center justify-between w-full p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center space-x-3">
              <Square className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Dimensions
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">W</span>
                <input
                  type="number"
                  value={width}
                  onChange={handleWidthChange}
                  className="w-16 px-2 py-1 text-sm text-center text-gray-800 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="h-5 w-px bg-gray-300" />

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">H</span>
                <input
                  type="number"
                  value={height}
                  onChange={handleHeightChange}
                  className="w-16 px-2 py-1 text-sm text-center text-gray-800 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Timeline Control */}
          <div className="flex items-center justify-between w-full p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Timeline
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Start</span>
                <input
                  type="number"
                  value={startTime}
                  onChange={handleStartChange}
                  className="w-16 px-2 py-1 text-sm text-center text-gray-800 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="h-5 w-px bg-gray-300" />

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">End</span>
                <input
                  type="number"
                  value={endTime}
                  onChange={handleEndChange}
                  className="w-16 px-2 py-1 text-sm text-center text-gray-800 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
