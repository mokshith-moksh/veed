import React, { useState, useEffect, useRef } from "react";
import Timeline from "@/components/TimeLine";
import { Button } from "@mantine/core";

const PlayButton = ({ canvas }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 60;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    const tenths = Math.floor((time % 1) * 10).toString();
    return `${minutes}:${seconds}.${tenths}`;
  };

  const handlePlay = () => {
    if (!canvas) return;
    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      setCurrentTime((prevTime) => {
        const newTime = prevTime + 0.1; // Update every 100ms for smoother timer
        if (newTime >= duration) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return duration;
        }

        updateCanvas(Math.floor(newTime)); // Update canvas with whole seconds
        return newTime;
      });
    }, 100);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  const updateCanvas = (time) => {
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => {
      const wasVisible = obj.visible;
      obj.visible = time >= obj.startTime && time <= obj.endTime;

      if (obj.getElement && obj.getElement().tagName === "VIDEO") {
        const videoElement = obj.getElement();
        if (obj.visible && !wasVisible) {
          videoElement.currentTime = 0;
          videoElement.play();
        } else if (!obj.visible && wasVisible) {
          videoElement.pause();
        }
      }
    });
    canvas.renderAll();
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Timer & Controls */}
      <div className="flex items-center justify-center gap-4 w-full mt-3">
        <div className="flex items-center gap-1">
          <span className="text-black text-lg font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <Button
          onClick={isPlaying ? handlePause : handlePlay}
          size="md"
          leftSection={
            isPlaying ? (
              <span className="text-base">⏸</span>
            ) : (
              <span className="text-base">▶</span>
            )
          }
          className="px-3 py-1"
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </div>

      {/* Timeline Container */}
      <div className="absolute bottom-0 w-full h-[75%]">
        <Timeline
          currentTime={currentTime}
          duration={duration}
          onTimeChange={(time) => {
            setCurrentTime(time);
            handlePause();
            updateCanvas(Math.floor(time));
          }}
        />
      </div>
    </div>
  );
};

export default PlayButton;
