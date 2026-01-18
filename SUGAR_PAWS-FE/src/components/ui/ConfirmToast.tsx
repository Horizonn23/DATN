import { toast } from "react-hot-toast";
import { FaExclamationTriangle, FaCheck, FaTimes } from "react-icons/fa";
import React from "react";

export function showConfirmToast(
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
) {
  toast(
    (t) => (
      <div className="flex items-center gap-3 min-w-[350px] max-w-md">
        <div className="flex items-center gap-2 flex-1">
          <FaExclamationTriangle
            size={20}
            className="text-white flex-shrink-0"
          />
          <span className="font-medium text-white break-words">{message}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-white text-red-500 text-sm rounded hover:bg-gray-100 transition-colors font-medium"
          >
            <FaCheck size={12} />
            Yes
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onCancel?.();
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 text-white text-sm rounded hover:bg-white/30 transition-colors font-medium"
          >
            <FaTimes size={12} />
            No
          </button>
        </div>
      </div>
    ),
    {
      style: {
        background: "#f59e0b", // Same warning color as WarningToast
        color: "#fff",
        minWidth: "350px",
        maxWidth: "500px",
        fontWeight: 500,
        padding: "12px 16px",
      },
      duration: Infinity, // Keep it open until user interacts
      position: "top-center",
      icon: null,
    },
  );
}
