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
    event.preventDefault(); // Prevent text selection during drag
  };

  const handleMouseMove = (event) => {
    if (!isDragging || !timelineRef.current) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    let newX = event.clientX - timelineRect.left;
    newX = Math.max(0, Math.min(newX, timelineRect.width));

    const newTime = (newX / timelineRect.width) * duration;
    onTimeChange(newTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = ""; // Reset cursor
  };

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
      document.body.style.cursor = "ew-resize";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
    };
  }, [isDragging]);

  return (
    <div className="relative w-full h-full bg-gray-50 flex items-center">
      {/* Timeline Track */}
      <div
        ref={timelineRef}
        className="absolute top-1/2 left-0 w-full h-[3px] bg-gray-300 rounded-full"
      ></div>

      {/* Time Markers */}
      <div className="absolute flex justify-between w-full text-gray-500 text-xs px-4">
        {[0, duration / 4, duration / 2, (3 * duration) / 4, duration].map(
          (time) => (
            <div key={time} className="flex flex-col items-center">
              <div className="h-2 w-px bg-gray-300 mb-1"></div>
              <span>{Math.floor(time)}s</span>
            </div>
          )
        )}
      </div>

      {/* Draggable Marker with Vertical Line */}
      <div
        ref={markerRef}
        className="absolute top-0 left-0 flex flex-col items-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        style={{ userSelect: "none" }}
      >
        {/* Marker Head */}
        <div className="w-5 h-5 bg-blue-600 rounded-full shadow-md flex items-center justify-center z-10">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>

        {/* Vertical Line */}
        <div className="w-px h-80 bg-blue-600 mt-[-2px]"></div>
      </div>

      {/* Current Time Indicator */}
      <div className="absolute top-0 left-0 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md transform -translate-y-full">
        {currentTime.toFixed(1)}s
      </div>
    </div>
  );
};

export default Timeline;
