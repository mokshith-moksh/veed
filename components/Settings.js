"use client";
import React from "react";
import { useState, useEffect } from "react";

const Settings = ({ canvas }) => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [originalDimensions, setOriginalDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (e) => {
        handleObjectSelection(e.selected[0]);
      });
      canvas.on("selection:updated", (e) => {
        handleObjectSelection(e.selected[0]);
      });
      canvas.on("selection:cleared", (e) => {
        handleObjectSelection(null);
        setSelectedObject(null);
        clearSettings();
      });
      canvas.on("object:modified", (e) => {
        handleObjectSelection(e.target);
      });
      canvas.on("object:scaling", (e) => {
        handleObjectSelection(e.target);
      });
    }
  }, [canvas]);

  const handleObjectSelection = (object) => {
    if (!object) return;
    setSelectedObject(object);
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

  return (
    <div>
      <div className="flex flex-col items-center justify-center w-[10vw] h-[10vh] bg-black">
        {selectedObject && (
          <>
            <input
              placeholder="Width"
              value={width}
              onChange={handleWidthChange}
              className="bg-white text-black"
            />
            <input
              placeholder="Height"
              value={height}
              onChange={handleHeightChange}
              className="bg-white text-black"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
