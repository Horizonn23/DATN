import React from "react";

interface CtaButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "profile";
}

const CtaButton: React.FC<CtaButtonProps> = ({
  text,
  onClick,
  className,
  disabled = false,
  isLoading = false,
  loadingText = "Loading...",
  icon,
  loadingIcon,
  type = "button",
  variant = "default",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "profile":
        return "mt-8 py-3 rounded-xl font-bold hover:bg-custom-rose w-full text-lg tracking-wide gap-2 uppercase shadow-lg";
      default:
        return "px-5 h-10 rounded-full text-[13px] hover:scale-105 hover:shadow-lg active:shadow-[inset_0_3px_7px_rgba(0,0,0,0.5)]";
    }
  };

  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={`${className} uppercase flex justify-center items-center bg-custom-wine text-white font-medium transition-all duration-300 transform ${getVariantClasses()} ${
        isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={isButtonDisabled}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          {loadingIcon && (
            <span className="animate-spin-slow">{loadingIcon}</span>
          )}
          {loadingText}
        </span>
      ) : (
        <>
          {icon && icon}
          {text}
        </>
      )}
    </button>
  );
};

export default CtaButton;
