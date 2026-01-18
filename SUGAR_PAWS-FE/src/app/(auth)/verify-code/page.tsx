"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DefaultLoading from "@/components/loading/DefaultLoading";
import { useAuthorization } from "@/hooks/queries/useAuthorization";
import { selectEmail } from "@/store/slices/userSlice";
import { useSelector } from "react-redux";

const VerifyCodePage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { verifyCode } = useAuthorization();
  const email = useSelector(selectEmail);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit code.");
      return;
    }

    setErrorMessage("");
    setLoading(true);
    try {
      if (!email) throw new Error("Email is missing from user state.");
      await verifyCode.mutateAsync({ code: enteredCode, email });
      setShowSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/");
      }, 1500);
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Verification Error:", error);
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Invalid verification code.",
      );
    }
    setLoading(false);
  };

  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-custom-yellow relative">
      <div className="w-[500px] flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden gap-2 py-10 px-8">
        <h1 className="text-[40px] font-bold text-custom-rose text-center">
          Verify Your Code
        </h1>
        <p className="text-[14px] text-gray-600 text-center mt-2">
          Congratulations on signing up! Please verify your email to complete
          the registration process.
        </p>
        <p className="text-[14px] text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email.
        </p>

        <div className="flex justify-center gap-3 mb-4">
          {code.map((num, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              value={num}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-semibold focus:outline-none focus:border-custom-rose transition-all"
            />
          ))}
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center">{errorMessage}</p>
        )}

        <button
          className="bg-custom-pink text-custom-purple w-full h-12 rounded-lg text-lg font-semibold hover:bg-custom-rose hover:text-white transition-all mb-4"
          onClick={handleVerifyCode}
        >
          Verify Code
        </button>
        <div className="text-center">
          <Link
            href="/signin"
            className="text-[14px] text-custom-purple italic hover:underline hover:text-custom-rose"
          >
            Back to Sign In
          </Link>
        </div>
        <p className="text-[14px] text-center text-custom-purple italic hover:underline hover:text-custom-rose">
          Resend code?
        </p>
      </div>
      {loading && <DefaultLoading />}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fadeIn">
          {/* Confetti effect */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-50">
            {[...Array(24)].map((_, i) => (
              <span
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.8}s`,
                  background: `hsl(${Math.random() * 360}, 90%, 60%)`,
                }}
              />
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-xl px-10 py-8 flex flex-col items-center animate-popupScale relative z-50 border-2 border-pink-200">
            {/* Congratulation icon */}
            <div className="text-5xl mb-3 animate-pop">🎉</div>
            {/* Animated checkmark */}
            <svg className="w-16 h-16 mb-4" viewBox="0 0 52 52">
              <circle
                className="stroke-green-400"
                cx="26"
                cy="26"
                r="25"
                fill="none"
                strokeWidth="4"
              />
              <path
                className="stroke-green-500"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l8 8 16-16"
                style={{
                  strokeDasharray: 36,
                  strokeDashoffset: 0,
                  animation: "drawCheck 0.6s ease forwards",
                }}
              />
            </svg>
            <h2 className="text-2xl font-bold text-pink-500 mb-2">
              Verified Successfully!
            </h2>
            <p className="text-base text-gray-700 text-center mb-1">
              Your email has been verified.
            </p>
            <p className="text-sm text-gray-500 text-center">
              Redirecting to homepage...
            </p>
          </div>
          <style jsx>{`
            .animate-fadeIn {
              animation: fadeInBg 0.3s;
            }
            @keyframes fadeInBg {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            .animate-popupScale {
              animation: popupScale 0.5s cubic-bezier(0.23, 1.12, 0.32, 1) both;
            }
            @keyframes popupScale {
              0% {
                transform: scale(0.7) translateY(40px);
                opacity: 0;
              }
              80% {
                transform: scale(1.05) translateY(-8px);
                opacity: 1;
              }
              100% {
                transform: scale(1) translateY(0);
                opacity: 1;
              }
            }
            @keyframes drawCheck {
              from {
                stroke-dashoffset: 36;
              }
              to {
                stroke-dashoffset: 0;
              }
            }
            .confetti {
              position: absolute;
              top: -20px;
              width: 10px;
              height: 18px;
              border-radius: 3px;
              opacity: 0.85;
              animation: confettiDrop 1.2s linear forwards;
            }
            @keyframes confettiDrop {
              0% {
                transform: translateY(0) rotate(0deg) scale(1);
                opacity: 1;
              }
              80% {
                opacity: 1;
              }
              100% {
                transform: translateY(400px) rotate(360deg) scale(0.7);
                opacity: 0;
              }
            }
            .animate-pop {
              animation: popIcon 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            }
            @keyframes popIcon {
              0% {
                transform: scale(0.5);
                opacity: 0;
              }
              80% {
                transform: scale(1.2);
                opacity: 1;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
    </main>
  );
};

export default VerifyCodePage;
