import { toast } from "react-hot-toast";
import { FaExclamationTriangle } from "react-icons/fa";
import React from "react";

export function showWarningToast(message: string) {
  toast(
    <div className="flex items-center gap-2 max-w-md">
      <FaExclamationTriangle size={20} className="flex-shrink-0" />
      <span className="break-words">{message}</span>
    </div>,
    {
      style: {
        background: "#f59e0b",
        color: "#fff",
        minWidth: "250px",
        maxWidth: "400px",
        fontWeight: 500,
        padding: "12px 16px",
      },
      icon: null,
      position: "top-center",
    },
  );
}
