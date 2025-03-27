import React from "react";
import { useState, useEffect, useRef } from "react";

const PlayButton = ({ canvas }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const handlePlay = () => {
    if (!canvas) return;

    setIsPlaying(true);
    setCurrentTime(0);

    intervalRef.current = setInterval(() => {
      setCurrentTime((prevTime) => {
        const newTime = prevTime + 1;
        // Loop through all objects and toggle visibility
        canvas.getObjects().forEach((obj) => {
          console.log(obj.startTime, obj.endTime);
          if (obj.startTime !== undefined && obj.endTime !== undefined) {
            obj.visible = newTime >= obj.startTime && newTime <= obj.endTime;
          }
        });
        canvas.renderAll(); // Update canvas
        if (newTime >= 10) {
          // Stop at 10 seconds
          clearInterval(intervalRef.current);
          setIsPlaying(false);
        }
        return newTime;
      });
    }, 1000);
  };
  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);
  return (
    <div>
      <div className="mt-4">
        <p className="text-black">Timer: {currentTime}s</p>
        <button
          onClick={handlePlay}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          disabled={isPlaying}
        >
          {isPlaying ? "Playing..." : "Play"}
        </button>
      </div>
    </div>
  );
};

export default PlayButton;
