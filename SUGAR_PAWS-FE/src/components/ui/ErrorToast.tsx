import React from "react";
import { toast, Toast } from "react-hot-toast";
import { FaExclamationCircle, FaTimes } from "react-icons/fa";

const ErrorToast = ({ t, message }: { t: Toast; message: string }) => (
  <div
    className={`flex items-center bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg min-w-[250px] relative transition-all duration-300
      ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
    `}
    style={{ pointerEvents: "auto" }}
  >
    <FaExclamationCircle className="w-6 h-6 mr-2" />
    <span className="flex-1">{message}</span>
    <button
      className="ml-4 p-1 rounded hover:bg-red-600 transition"
      onClick={() => toast.dismiss(t.id)}
    >
      <FaTimes size={40} />
    </button>
  </div>
);

export function showErrorToast(message: string) {
  toast.error(
    <div className="flex items-center gap-2 max-w-md">
      <FaExclamationCircle size={20} className="flex-shrink-0" />
      <span className="break-words">{message}</span>
    </div>,
    {
      style: {
        background: "#ef4444",
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

export default ErrorToast;
