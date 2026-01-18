"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

interface SizeCheckboxesProps {
  sizes: string[];
  selectedSizes: string[];
  handleSizeChange: (size: string) => void;
}

const SizeCheckboxes: React.FC<SizeCheckboxesProps> = ({
  sizes,
  selectedSizes,
  handleSizeChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleOpen}
      >
        <h2 className="text-[12px] font-[600]">Size</h2>
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
        className="overflow-hidden mt-3"
      >
        {sizes.map((size) => (
          <div key={size} className="flex items-center gap-2 mb-[5px]">
            <input
              type="checkbox"
              id={size}
              name={size}
              value={size}
              checked={selectedSizes.includes(size)}
              onChange={() => handleSizeChange(size)}
              className="w-4 h-4 appearance-none border-[1px] border-black rounded-md checked:bg-black checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:h-full checked:before:w-full checked:before:text-[12px] font-bold"
            />
            <label htmlFor={size} className="text-[12px] font-light">
              {size}
            </label>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SizeCheckboxes;
