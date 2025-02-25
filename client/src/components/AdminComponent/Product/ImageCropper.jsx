import { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";

const ImageCropper = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({
    unit: "px",
    width: 200, // initial width
    height: 200, // initial height
    x: 0,
    y: 0,
    aspect: 1, // enforce square crop
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);

  const onLoad = (img) => {
    imageRef.current = img;
    // Optionally, you can recalculate and center the crop if desired:
    const aspect = 1;
    const width = img.width * 0.9;
    const height = width / aspect;
    const x = (img.width - width) / 2;
    const y = (img.height - height) / 2;
    setCrop({
      unit: "px",
      width,
      height,
      x,
      y,
      aspect,
    });
  };

  const generateCroppedImage = async (imageRef, completedCrop) => {
    if (!imageRef?.current || !completedCrop?.width || !completedCrop?.height) {
      return null;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    // Set the canvas size to the cropped area size
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    if (ctx) {
      ctx.drawImage(
        imageRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error("Canvas is empty");
              return;
            }
            const croppedImageUrl = URL.createObjectURL(blob);
            resolve(croppedImageUrl);
          },
          "image/jpeg",
          1
        );
      });
    }
  };

  const handleCropComplete = async () => {
    const croppedImageUrl = await generateCroppedImage(imageRef, completedCrop);
    if (croppedImageUrl) {
      onCropComplete(croppedImageUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
        <div className="max-h-[70vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1} // keep the crop square
            className="max-w-full"
          >
            <img
              ref={imageRef}
              src={image}
              alt="Crop preview"
              onLoad={(e) => onLoad(e.target)}
              className="max-w-full"
            />
          </ReactCrop>
        </div>
        
        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={onCancel} variant="outline" className="px-6">
            Cancel
          </Button>
          <Button onClick={handleCropComplete} className="px-6">
            Crop & Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
