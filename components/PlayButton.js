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

        canvas.getObjects().forEach((obj) => {
          if (obj.startTime !== undefined && obj.endTime !== undefined) {
            const wasVisible = obj.visible;
            obj.visible = newTime >= obj.startTime && newTime <= obj.endTime;

            // Handle video playback
            if (obj.getElement && obj.getElement().tagName === "VIDEO") {
              const videoElement = obj.getElement();
              if (obj.visible && !wasVisible) {
                // Video just became visible → Play
                videoElement.currentTime = 0; // Optional: Restart from beginning
                videoElement.play();
              } else if (!obj.visible && wasVisible) {
                // Video just became invisible → Pause
                videoElement.pause();
              }
            }
          }
        });

        canvas.renderAll();

        if (newTime >= 10) {
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
