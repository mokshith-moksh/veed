import React, { useState, useEffect, useRef } from "react";
import Timeline from "@/components/TimeLine";

const PlayButton = ({ canvas }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 60;

  const handlePlay = () => {
    if (!canvas) return;
    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      setCurrentTime((prevTime) => {
        const newTime = prevTime + 1;
        if (newTime >= duration) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return duration;
        }

        updateCanvas(newTime);
        return newTime;
      });
    }, 1000);
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
    <div className="w-full">
      <div className="mt-4">
        <p className="text-black">Timer: {currentTime}s</p>
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 mr-2"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <div className="">
        <Timeline
          currentTime={currentTime}
          duration={duration}
          onTimeChange={(time) => {
            setCurrentTime(time);
            handlePause(); // Pause playback when user drags and releases timeline
            updateCanvas(time);
          }}
        />
      </div>
    </div>
  );
};

export default PlayButton;
