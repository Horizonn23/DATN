"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export interface FaqDropdownProps {
  title: string;
  description: string;
}

const FaqDropdown: React.FC<FaqDropdownProps> = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-custom-pink rounded-[10px] text-[12px]">
      <div
        className="flex justify-between items-center cursor-pointer min-h-11 px-5"
        onClick={toggleDropdown}
      >
        <span className="font-semibold">{title}</span>
        <FontAwesomeIcon
          icon={isOpen ? faMinus : faPlus}
          className="ml-2 transition-transform duration-300 ease-in-out transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <hr className="border-t border-white border-2" />
        <p className="mt-2 text-gray-700 pt-2 px-5 pb-4">
          {description.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
};

export default FaqDropdown;
