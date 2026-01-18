import React from "react";
import Modal from "./Modal";
import CtaButton from "./CtaButton";
import SecondaryButton from "./SecondaryButton";
import { useRouter } from "next/navigation";

interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  open,
  onClose,
  message = "You need to be logged in to add items to your cart",
}) => {
  const router = useRouter();

  if (!open) return null;

  const handleSignIn = () => {
    router.push("/signin");
    onClose();
  };

  const handleSignUp = () => {
    router.push("/signup");
    onClose();
  };

  return (
    <Modal onClose={onClose} size="small" open={open}>
      <div className="flex flex-col items-center p-2 sm:p-4">
        {/* Lock Icon */}
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 animate-fadeIn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-custom-purple"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h3 className="text-2xl font-semibold text-custom-purple mb-3 text-center transition-all duration-300 ease-in-out">
          Sign In Required
        </h3>

        <p className="text-center mb-8 text-gray-600 max-w-xs">{message}</p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <SecondaryButton
            text="Sign Up"
            onClick={handleSignUp}
            className="flex-1 transform hover:scale-105 transition-transform duration-200"
          />
          <CtaButton
            text="Sign In"
            onClick={handleSignIn}
            className="flex-1 transform hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg"
          />
        </div>

        <button
          className="mt-6 text-gray-500 text-sm hover:text-custom-purple hover:underline transition-colors duration-200"
          onClick={onClose}
        >
          Continue Shopping
        </button>
      </div>
    </Modal>
  );
};

export default LoginRequiredModal;
