import React from "react";
import { useState, useEffect, useRef } from "react";
import { Image } from "fabric";
import { FabricImage } from "fabric";
import { DropzoneButton } from "./DropZoneButton";
import { showNotification } from "@mantine/notifications";
import { Progress } from "@mantine/core";

const Video = ({ canvas }) => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(0); // Track current time in state
  const [duration, setDuration] = useState(0); // Track duration in state
  const fileInputRef = useRef(null);
  const videoRefs = useRef(new Map());
  const timeUpdateListeners = useRef(new Map());

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

      videoRefs.current.forEach((videoElement) => {
        videoElement.pause();
        videoElement.removeEventListener(
          "timeupdate",
          timeUpdateListeners.current.get(videoElement)
        );
      });
      videoRefs.current.clear();
      timeUpdateListeners.current.clear();
    };
  }, [canvas]);

  const handleObjectSelection = (object) => {
    if (!object) return;

    setSelectedObject(object);

    if (object.getElement && object.getElement().tagName === "VIDEO") {
      const videoElement = object.getElement();
      setVideoSrc(videoElement.src);
      setCurrentTime(videoElement.currentTime);
      setDuration(videoElement.duration);
    }
  };

  const clearSettings = () => {
    setVideoSrc("");
    setCurrentTime(0);
    setDuration(0);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type;
    const url = URL.createObjectURL(file);

    if (fileType.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const image = await Image.fromURL(e.target.result);
        image.scale(0.5);
        image.startTime = 2;
        image.endTime = 8;
        canvas.add(image);
        canvas.centerObject(image);
        canvas.setActiveObject(image);
      };
      reader.readAsDataURL(file);
    } else if (fileType.startsWith("video/")) {
      setLoadPercentage(0);
      setVideoSrc(null);
      setUploadMessage("");
      setCurrentTime(0);
      setDuration(0);

      const videoElement = document.createElement("video");
      videoElement.src = url;
      videoElement.crossOrigin = "anonymous";

      videoRefs.current.set(videoElement, { isPlaying: false });

      videoElement.addEventListener("loadedmetadata", () => {
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;
        videoElement.width = videoWidth;
        videoElement.height = videoHeight;

        const scale = Math.min(
          canvas.width / videoWidth,
          canvas.height / videoHeight
        );

        const fabricVideo = new FabricImage(videoElement, {
          left: 0,
          top: 0,
          scaleX: scale,
          scaleY: scale,
        });

        videoElement.currentTime = 0;
        videoElement.play().then(() => {
          videoElement.pause();
          canvas.add(fabricVideo);
          canvas.setActiveObject(fabricVideo);
          canvas.renderAll();
          setVideoSrc(url);
          setDuration(videoElement.duration);
          setUploadMessage("Video uploaded successfully");
          showNotification({
            title: "Image uploaded",
            message: "Your image was successfully added",
            color: "teal",
          });
          setTimeout(() => setUploadMessage(""), 1000);
        });
      });

      videoElement.addEventListener("progress", () => {
        if (videoElement.buffered.length > 0) {
          const bufferEnd = videoElement.buffered.end(
            videoElement.buffered.length - 1
          );
          const duration = videoElement.duration;
          if (duration > 0) {
            setLoadPercentage((bufferEnd / duration) * 100);
          }
        }
      });

      videoElement.addEventListener("error", console.error);
    }
    e.target.value = "";
  };

  const handlePlayPauseVideo = () => {
    if (!selectedObject || !selectedObject.getElement()) return;

    const videoElement = selectedObject.getElement();
    const videoState = videoRefs.current.get(videoElement);

    if (!videoState) return;

    if (videoElement.paused) {
      // Pause all other videos first
      videoRefs.current.forEach((state, element) => {
        if (element !== videoElement && !element.paused) {
          element.pause();
          state.isPlaying = false;
        }
      });

      // Play the selected video
      videoElement.play();
      videoState.isPlaying = true;

      // Add timeupdate listener if not already present
      if (!timeUpdateListeners.current.has(videoElement)) {
        const listener = () => {
          setCurrentTime(videoElement.currentTime);
          canvas.renderAll();
        };
        videoElement.addEventListener("timeupdate", listener);
        timeUpdateListeners.current.set(videoElement, listener);
      }
    } else {
      videoElement.pause();
      videoState.isPlaying = false;
    }
  };

  const handleSeek = (newTime) => {
    if (!selectedObject || !selectedObject.getElement()) return;

    const videoElement = selectedObject.getElement();
    videoElement.currentTime = newTime;
    setCurrentTime(newTime);
    canvas.renderAll();
  };

  const handleForward = () => {
    if (!selectedObject || !selectedObject.getElement()) return;

    const videoElement = selectedObject.getElement();
    const newTime = Math.min(
      videoElement.duration,
      videoElement.currentTime + 5
    );
    handleSeek(newTime);
  };

  const handleBackward = () => {
    if (!selectedObject || !selectedObject.getElement()) return;

    const videoElement = selectedObject.getElement();
    const newTime = Math.max(0, videoElement.currentTime - 5);
    handleSeek(newTime);
  };

  const handleVideoUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const isSelectedVideoPlaying = () => {
    if (!selectedObject || !selectedObject.getElement()) return false;
    const videoElement = selectedObject.getElement();
    const videoState = videoRefs.current.get(videoElement);
    return videoState ? videoState.isPlaying : false;
  };

  return (
    <div>
      <DropzoneButton
        handleVideoUploadButtonClick={handleVideoUploadButtonClick}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleVideoUpload}
        style={{ display: "none" }}
      />
      {videoSrc && selectedObject && (
        <div className="flex flex-col items-center gap-2 mt-12">
          {/* Timeline display */}
          <div className="w-full bg-gray-200 h-2 rounded-full relative">
            <div
              className="absolute top-0 left-0 bg-blue-500 h-2 rounded-full"
              style={{
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
            <div className="absolute top-3 left-0 w-full flex justify-between px-1 text-xs text-gray-600">
              <span>{formatTime(0)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackward}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={handlePlayPauseVideo}
              className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 focus:outline-none text-white"
            >
              {isSelectedVideoPlaying() ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={handleForward}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Time display */}
          <div className="text-sm text-gray-600">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {loadPercentage > 0 && loadPercentage < 100 && (
            <Progress value={loadPercentage} size="sm" mt="sm" animate />
          )}
          {uploadMessage && <div className="text-center">{uploadMessage}</div>}
        </div>
      )}
    </div>
  );
};

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00.0";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const tenths = Math.floor((seconds % 1) * 10);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}.${tenths}`;
}

export default Video;
