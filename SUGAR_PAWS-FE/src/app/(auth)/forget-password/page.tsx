"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthorization } from "@/hooks/queries/useAuthorization";
import { REGEX } from "@/const/common";
import { useRouter } from "next/navigation";
import DefaultLoading from "@/components/loading/DefaultLoading";
import { motion } from "framer-motion";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>("");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { forgotPassword } = useAuthorization();
  const router = useRouter();

  const handleForgotPassword = async () => {
    if (!email) {
      setEmailErrorMessage("Email is required.");
      return;
    }
    if (emailErrorMessage) return;

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await forgotPassword.mutateAsync({ email });

      setSuccessMessage(
        "Password reset instructions have been sent to your email.",
      );
      setLoading(false);

      setTimeout(() => {
        router.push("/signin");
      }, 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false);
      setErrorMessage(error.message || "Failed to send password reset email.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!REGEX.EMAIL.test(value)) {
      setEmailErrorMessage("Please enter a valid email address.");
    } else {
      setEmailErrorMessage("");
    }
    // Clear messages when user types
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <motion.main
      className="w-full min-h-screen flex justify-center items-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-[1200px] min-w-[928px] w-[60%] flex bg-white rounded-xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.95, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.1,
          type: "spring",
          stiffness: 60,
          damping: 20,
        }}
      >
        <motion.div
          className="w-1/2 relative"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            type: "spring",
            stiffness: 50,
          }}
        >
          <Image
            src="/assets/images/signin.png"
            alt="Forgot password image"
            fill
            sizes="50vw"
            className="object-cover"
          />
        </motion.div>
        <motion.div
          className="w-1/2 py-16"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            type: "spring",
            stiffness: 50,
          }}
        >
          <div className="w-[340px] flex flex-col justify-center items-start m-auto gap-4">
            <motion.h1
              className="text-[40px] font-semibold text-custom-rose"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Forgot Password
            </motion.h1>
            <motion.p
              className="text-[14px] text-gray-600"
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Enter your email address and we&apos;ll send you instructions to
              reset your password.
            </motion.p>

            <motion.div
              className="w-full"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                className="w-full h-10 border-[1px] border-custom-purple rounded-[15px] pl-[20px] placeholder:text-[12px] placeholder:text-custom-purple text-[12px] focus:outline-none focus:border-custom-rose transition-all duration-300 focus:scale-[1.02]"
              />
              {emailErrorMessage && (
                <motion.p
                  className="text-red-500 text-[12px] mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {emailErrorMessage}
                </motion.p>
              )}
              {errorMessage && (
                <motion.p
                  className="text-red-500 text-[12px] mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {errorMessage}
                </motion.p>
              )}
              {successMessage && (
                <motion.p
                  className="text-green-500 text-[12px] mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {successMessage}
                </motion.p>
              )}
            </motion.div>

            <motion.button
              className="bg-custom-pink text-custom-purple w-full h-10 rounded-[10px] text-[15px] font-medium hover:bg-custom-rose hover:text-white active:bg-custom-purple active:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleForgotPassword}
              disabled={loading || !email || emailErrorMessage !== ""}
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.7,
                type: "spring",
                stiffness: 80,
                damping: 20,
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 },
              }}
            >
              {loading ? "Sending..." : "Send Reset Instructions"}
            </motion.button>

            <motion.div
              className="w-full flex flex-col gap-2"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link
                href="/signin"
                className="text-[12px] text-custom-purple italic hover:underline hover:text-custom-rose transition-colors duration-300 text-center"
              >
                ← Back to Sign In
              </Link>
              <div className="text-center">
                <p className="text-[12px]">
                  Don&apos;t have an account?
                  <Link
                    href="/signup"
                    className="text-[12px] pl-2 text-custom-purple italic hover:underline hover:text-custom-rose transition-colors duration-300"
                  >
                    Go to Sign Up Page
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      {loading && <DefaultLoading />}
    </motion.main>
  );
};

export default ForgotPasswordPage;
