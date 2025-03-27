import React from "react";
import { useState, useEffect, useRef } from "react";
import { Image } from "fabric";
import { FabricImage } from "fabric";
const Video = ({ canvas }) => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [fabricVideo, setFabricVideo] = useState(null);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    const fileType = file.type;
    if (!file) {
      console.log("No file selected");
      return;
    }
    if (fileType.startsWith("image/")) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const image = await Image.fromURL(e.target.result);
        image.scale(0.5);
        image.startTime = 2; // Start time in seconds
        image.endTime = 8; // End time in seconds
        canvas.add(image);
        canvas.centerObject(image);
        canvas.setActiveObject(image);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
    if (fileType.startsWith("video/")) {
      setLoadPercentage(0);
      setVideoSrc(null);
      setUploadMessage("");

      const url = URL.createObjectURL(file);
      setVideoSrc(url);

      const videoElement = document.createElement("video");
      videoElement.src = url;
      videoElement.crossOrigin = "anonymous";
      videoElement.addEventListener("loadedmetadata", () => {
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;
        videoElement.width = videoWidth;
        videoElement.height = videoHeight;

        const canvasHeight = canvas.height;
        const canvasWidth = canvas.width;

        const scale = Math.min(
          canvasWidth / videoWidth,
          canvasHeight / videoHeight
        );

        canvas.renderAll();

        const fabricImage = new FabricImage(videoElement, {
          left: 0,
          top: 0,
          scaleX: scale,
          scaleY: scale,
        });

        videoElement.currentTime = 0; // Seek to start
        videoElement.play().then(() => {
          videoElement.pause(); // Pause immediately after 1 frame
          setFabricVideo(fabricImage); // Update Fabric.js object
          canvas.renderAll(); // Refresh canvas
        });
        canvas.add(fabricImage);
        canvas.renderAll();

        setUploadMessage("Video uploaded successfully");
        setTimeout(() => {
          setUploadMessage("");
        }, 1000);
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
      videoElement.addEventListener("error", (error) => {
        console.error("Error loading video:", error);
      });
      videoRef.current = videoElement;
    }
  };
  const handlePlayPauseVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        videoRef.current.addEventListener("timeupdate", () => {
          fabricVideo.setElement(videoRef.current);
          canvas.renderAll();
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  const handleStopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      canvas.renderAll();
    }
  };
  const handleVideoUploadButtonClick = () => {
    fileInputRef.current.click();
  };
  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleVideoUpload}
        style={{ display: "none" }}
      />
      <button onClick={handleVideoUploadButtonClick} className="text-black">
        Multi Upload
      </button>
      {videoSrc && (
        <div>
          <div className="flex gap-14">
            <button onClick={handlePlayPauseVideo} className="text-black">
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={handleStopVideo} className="text-black">
              Stop
            </button>
          </div>

          <div className="flex flex-col items-center justify-center w-[10vw] h-[10vh] bg-black">
            <div className="flex flex-col items-center justify-center w-[10vw] h-[10vh] bg-black">
              {loadPercentage > 0 && (
                <div className="text-center">
                  <div className="text-center">
                    Uploading video... {loadPercentage}%
                  </div>
                </div>
              )}
              {uploadMessage && (
                <div className="text-center">{uploadMessage}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;
