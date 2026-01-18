import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export type Colors = {
  colorName: string;
  colorCode: string | string[];
};

interface ColorCheckboxesProps {
  colors: Colors[];
  selectedColors: Colors[];
  handleColorChange: (colorName: string) => void;
}

const ColorCheckboxes = ({
  colors,
  selectedColors,
  handleColorChange,
}: ColorCheckboxesProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen(!isOpen);

  const isColorSelected = (colorName: string) => {
    return selectedColors.some((color) => color.colorName === colorName);
  };

  const renderColorDiv = (colorCode: string | string[], colorName: string) => {
    let backgroundStyle: string;

    if (Array.isArray(colorCode) && colorCode.length === 2) {
      backgroundStyle = `linear-gradient(to bottom right, ${colorCode[0]} 50%, ${colorCode[1]} 50%)`;
    } else {
      backgroundStyle =
        typeof colorCode === "string"
          ? colorCode
          : colorCode[0] || "transparent";
    }

    return (
      <div
        className="w-6 h-6 rounded-full relative border border-gray-300"
        style={{
          background: backgroundStyle,
          boxShadow: isColorSelected(colorName)
            ? "0 0 0 2px #ff7eb9, 0 0 0 4px white"
            : "none",
        }}
      />
    );
  };

  return (
    <div>
      <div
        className="flex items-center justify-between mt-4 mb-2 cursor-pointer"
        onClick={toggleOpen}
      >
        <h2 className="text-[12px] font-[600]">Color</h2>
        <motion.div
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          whileHover={{ scale: 1.2 }}
        >
          <FontAwesomeIcon
            icon={isOpen ? faMinus : faPlus}
            className="text-sm"
            size="xs"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="pt-1 grid grid-cols-3 gap-4">
          {colors.map(({ colorCode, colorName }, index) => (
            // Thẻ div cha xử lý onClick và hover
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer transition-all hover:scale-105 duration-150 ease-in-out"
              onClick={() => handleColorChange(colorName)}
            >
              {/* Div chỉ để hiển thị màu, không cần onClick */}
              <div>{renderColorDiv(colorCode, colorName)}</div>
              {/* Dùng span hoặc div thay cho label */}
              <span className="text-[12px] font-light mt-1 text-center">
                {colorName}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ColorCheckboxes;
