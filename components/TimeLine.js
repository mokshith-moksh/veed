import { useEffect, useRef, useState } from "react";

const Timeline = ({ currentTime, duration, onTimeChange }) => {
  const timelineRef = useRef(null);
  const markerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (markerRef.current && timelineRef.current) {
      const timelineWidth = timelineRef.current.clientWidth;
      const position = (currentTime / duration) * timelineWidth;
      markerRef.current.style.transform = `translateX(${position}px)`;
    }
  }, [currentTime, duration]);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    moveMarker(event);
  };

  const handleMouseMove = (event) => {
    if (!isDragging || !timelineRef.current) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    let newX = event.clientX - timelineRect.left;
    newX = Math.max(0, Math.min(newX, timelineRect.width)); // Keep within bounds

    const newTime = (newX / timelineRect.width) * duration;
    onTimeChange(newTime);
  };

  const handleMouseUp = () => setIsDragging(false);

  const moveMarker = (event) => {
    if (!timelineRef.current) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    let newX = event.clientX - timelineRect.left;
    newX = Math.max(0, Math.min(newX, timelineRect.width));

    const newTime = (newX / timelineRect.width) * duration;
    onTimeChange(newTime);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="relative w-full h-12 bg-gray-100 flex items-center">
      {/* Timeline */}
      <div
        ref={timelineRef}
        className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300"
      ></div>

      {/* Time Markers */}
      <div className="absolute flex justify-between w-full text-gray-500 text-xs px-4">
        <span>0s</span>
        <span>{Math.floor(duration / 4)}s</span>
        <span>{Math.floor(duration / 2)}s</span>
        <span>{Math.floor((3 * duration) / 4)}s</span>
        <span>{duration}s</span>
      </div>

      {/* Draggable Marker */}
      <div
        ref={markerRef}
        className="absolute top-0 left-0 w-4 h-8 bg-blue-500 rounded-full cursor-pointer transform -translate-x-1/2"
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default Timeline;
