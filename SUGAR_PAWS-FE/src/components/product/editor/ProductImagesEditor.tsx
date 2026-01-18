import React from "react";
import { Button, Image, Text } from "@mantine/core";
import { IconTrash, IconUpload } from "@tabler/icons-react";

interface ProductImagesEditorProps {
  existingImages: string[];
  setExistingImages: React.Dispatch<React.SetStateAction<string[]>>;
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ProductImagesEditor: React.FC<ProductImagesEditorProps> = ({
  existingImages,
  setExistingImages,
  images,
  setImages,
  fileInputRef,
}) => {
  const handleRemoveExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveNewImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <Text className="font-semibold mb-2">Product Images</Text>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          setImages((prev) => [...prev, ...files]);
        }}
        className="hidden"
      />

      <div className="flex gap-2 flex-wrap">
        {/* Existing Images */}
        {existingImages.map((imageUrl, idx) => (
          <div
            key={`existing-${idx}`}
            className="relative border rounded overflow-hidden w-24 h-24"
          >
            <Image
              src={imageUrl}
              alt={`Current Product Image ${idx + 1}`}
              fit="cover"
              className="w-full h-full"
            />
            <Button
              variant="subtle"
              color="red"
              size="xs"
              onClick={() => handleRemoveExistingImage(idx)}
              className="absolute top-1 right-1"
            >
              <IconTrash size={16} />
            </Button>
          </div>
        ))}

        {/* New Images */}
        {images.map((image, idx) => (
          <div
            key={`new-${idx}`}
            className="relative border rounded overflow-hidden w-24 h-24"
          >
            <Image
              src={URL.createObjectURL(image)}
              alt={`New Product Image ${idx + 1}`}
              fit="cover"
              className="w-full h-full"
            />
            <Button
              variant="subtle"
              color="red"
              size="xs"
              onClick={() => handleRemoveNewImage(idx)}
              className="absolute top-1 right-1"
            >
              <IconTrash size={16} />
            </Button>
          </div>
        ))}

        {/* Upload Button */}
        <Button
          variant="light"
          size="xs"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 h-24 w-24 justify-center"
        >
          <IconUpload size={16} />
          Upload Images
        </Button>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        <ul className="list-disc ml-4">
          <li>You can upload multiple images at once</li>
          <li>Recommended image size: 800x800 pixels or larger</li>
          <li>Supported formats: JPG, PNG, WEBP</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductImagesEditor;
