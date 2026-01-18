"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAuthorization } from "@/hooks/queries/useAuthorization";
import { useRouter } from "next/navigation";
import DefaultLoading from "@/components/loading/DefaultLoading";
import { useAppDispatch } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { setAuthToken } from "@/helper/storage";
import { motion } from "framer-motion";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    reenterPassword: "",
  });

  const { signUp } = useAuthorization();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.reenterPassword) {
      setErrorMessage("Passwords do not match.");
    } else {
      setErrorMessage("");
      setLoading(true);

      try {
        const response = await signUp.mutateAsync({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
        if (response && response.accessToken) {
          setAuthToken(response.accessToken);
        } else {
          throw new Error("Invalid response from server.");
        }
        dispatch(
          setUser({
            username: formData.username,
            email: formData.email,
            name: formData.name,
          }),
        );
        router.push("/verify-code");
      } catch (error) {
        console.error("Sign Up Error:", error);
        setErrorMessage("Invalid username or password.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.main
      className="w-full min-h-screen flex justify-center items-center"
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
            alt="Sign up image"
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
              Sign Up
            </motion.h1>
            <motion.p
              className="text-[14px]"
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Join us today! 😊
            </motion.p>

            <motion.div
              className="w-full"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-10 border-[1px] border-custom-purple rounded-[15px] pl-[20px] placeholder:text-[12px] placeholder:text-custom-purple text-[12px] focus:outline-none focus:border-custom-rose transition-all duration-300 focus:scale-[1.02]"
              />
            </motion.div>

            <motion.div
              className="w-full"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
            >
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="w-full h-10 border-[1px] border-custom-purple rounded-[15px] pl-[20px] placeholder:text-[12px] placeholder:text-custom-purple text-[12px] focus:outline-none focus:border-custom-rose transition-all duration-300 focus:scale-[1.02]"
              />
            </motion.div>

            <motion.div
              className="w-full"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-10 border-[1px] border-custom-purple rounded-[15px] pl-[20px] placeholder:text-[12px] placeholder:text-custom-purple text-[12px] focus:outline-none focus:border-custom-rose transition-all duration-300 focus:scale-[1.02]"
              />
            </motion.div>

            <motion.div
              className="w-full"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75 }}
            >
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-10 border-[1px] border-custom-purple rounded-[15px] pl-[20px] placeholder:text-[12px] placeholder:text-custom-purple text-[12px] focus:outline-none focus:border-custom-rose transition-all duration-300 focus:scale-[1.02]"
                />
                <FontAwesomeIcon
                  width={16}
                  height={16}
                  icon={showPassword ? faEye : faEyeSlash}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-custom-purple hover:text-custom-rose transition-colors duration-300"
                  onClick={togglePasswordVisibility}
                />
              </div>
            </motion.div>

            <motion.div
              className="w-full"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="reenterPassword"
                  placeholder="Re-enter Password"
                  value={formData.reenterPassword}
                  onChange={handleChange}
                  className="w-full h-10 border-[1px] border-custom-purple rounded-[15px] pl-[20px] placeholder:text-[12px] placeholder:text-custom-purple text-[12px] focus:outline-none focus:border-custom-rose transition-all duration-300 focus:scale-[1.02]"
                />
                <FontAwesomeIcon
                  width={16}
                  height={16}
                  icon={showConfirmPassword ? faEye : faEyeSlash}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-custom-purple hover:text-custom-rose transition-colors duration-300"
                  onClick={toggleConfirmPasswordVisibility}
                />
              </div>
              {errorMessage && (
                <motion.p
                  className="text-red-500 text-[12px]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {errorMessage}
                </motion.p>
              )}
            </motion.div>

            <motion.button
              className="bg-custom-pink text-custom-purple w-full h-10 rounded-[10px] text-[15px] font-medium hover:bg-custom-rose hover:text-white active:bg-custom-purple active:text-white transition-all duration-300"
              onClick={handleSignUp}
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.85,
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
              Sign Up
            </motion.button>

            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <p className="text-[12px] mt-1">
                Already have an account?
                <Link
                  href={"/signin"}
                  className="text-[12px] pl-2 text-custom-purple italic hover:underline hover:text-custom-rose transition-colors duration-300"
                >
                  Go to Sign In Page
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      {loading && <DefaultLoading />}
    </motion.main>
  );
};

export default SignUpPage;
