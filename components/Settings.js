"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Square } from "lucide-react";
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
    <div>
      <div className="flex flex-col items-center justify-center w-full h-full">
        {selectedObject && (
          <>
            <div className="flex items-center border rounded-lg px-4 py-2 space-x-3 text-gray-700">
              {/* Width */}
              <Square className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Width</span>
              <input
                type="text"
                placeholder="Width"
                value={width}
                onChange={handleWidthChange}
                className="bg-white text-black text-center outline-none w-16"
              />

              {/* Divider */}
              <span className="text-gray-400">|</span>

              {/* Height */}
              <span className="text-gray-600">Height</span>
              <input
                type="text"
                placeholder="Height"
                value={height}
                onChange={handleHeightChange}
                className="bg-white text-black text-center outline-none w-16"
              />
              <Square className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex items-center border rounded-lg px-4 py-2 space-x-3 text-gray-700">
              {/* Start Time */}
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Start</span>
              <input
                type="text"
                placeholder="Start"
                value={startTime}
                onChange={handleStartChange}
                className="bg-white text-black text-center outline-none w-16"
              />

              {/* Divider */}
              <span className="text-gray-400">|</span>

              {/* End Time */}
              <span className="text-gray-600">End</span>
              <input
                type="text"
                placeholder="End"
                value={endTime}
                onChange={handleEndChange}
                className="bg-red-300 text-black text-center outline-none w-16"
              />
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
