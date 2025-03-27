import React from "react";
import { Image } from "fabric";
const Images = ({ canvas }) => {
  function fileHandler(e) {
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
  return (
    <div>
      <button title="Add image">
        <input type="file" accept=".png, .jpg, .jpeg" onChange={fileHandler} />
      </button>
    </div>
  );
};

export default Images;
