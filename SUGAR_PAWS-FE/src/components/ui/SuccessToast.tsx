import { toast } from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import React from "react";

export function showSuccessToast(message: string) {
  toast.success(
    <div className="flex items-center gap-2 max-w-md">
      <FaCheckCircle size={20} className="flex-shrink-0" />
      <span className="break-words">{message}</span>
    </div>,
    {
      style: {
        background: "#22c55e",
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
