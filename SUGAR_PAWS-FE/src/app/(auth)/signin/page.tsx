"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAuthorization } from "@/hooks/queries/useAuthorization";
import { REGEX } from "@/const/common";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/helper/storage";
import DefaultLoading from "@/components/loading/DefaultLoading";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { signIn } = useAuthorization();
  const dispatch = useDispatch();
  const router = useRouter();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async () => {
    if (!username) {
      setUsernameErrorMessage("Username or email is required.");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }
    if (usernameErrorMessage) return;

    try {
      setLoading(true);
      const response = await signIn.mutateAsync({
        identifier: username,
        password,
      });

      if (response && response.accessToken) {
        // Lưu token
        setAuthToken(response.accessToken);

        // Lưu user info vào localStorage cho Socket connection
        const userInfo = {
          id: response.id,
          username: response.username,
          email: response.email,
          name: response.name,
          role: response.role,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));

        // Cập nhật Redux state với thông tin user
        dispatch(
          setUser({
            username: response.username,
            email: response.email,
            name: response.name,
            role: response.role,
          }),
        );

        setLoading(false);

        // Điều hướng dựa trên role
        if (response.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        throw new Error("Invalid response from server.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setLoading(false);
      setErrorMessage("Invalid username or password.");
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (!REGEX.USERNAME.test(value) && !REGEX.EMAIL.test(value)) {
      setUsernameErrorMessage("Invalid username or email format.");
    } else {
      setUsernameErrorMessage("");
    }
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
            alt="Sign in image"
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
              Sign In
            </motion.h1>
            <motion.p
              className="text-[14px]"
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Great to see you again! 😊
            </motion.p>

            <motion.div
              className="w-full"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <input
                type="text"
                placeholder="Enter your username/email"
                value={username}
                onChange={handleUsernameChange}
                className="w-full h-10 border-[1px] border-custom-purple rounded-[15px] pl-[20px] placeholder:text-[12px] placeholder:text-custom-purple text-[12px] focus:outline-none focus:border-custom-rose transition-all duration-300 focus:scale-[1.02]"
              />
              {usernameErrorMessage && (
                <motion.p
                  className="text-red-500 text-[12px]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {usernameErrorMessage}
                </motion.p>
              )}
            </motion.div>
            <motion.div
              className="w-full"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <motion.div
                className="flex items-center mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2 w-5 h-5 appearance-none border-2 border-gray-300 rounded-md checked:bg-custom-rose checked:border-custom-pink checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:h-full checked:before:w-full checked:before:text-[12px] font-bold transition-all duration-300"
                />
                <label className="text-[12px]">Remember Me</label>
              </motion.div>
            </motion.div>
            <motion.button
              className="bg-custom-pink text-custom-purple w-full h-10 rounded-[10px] text-[15px] font-medium hover:bg-custom-rose hover:text-white active:bg-custom-purple active:text-white transition-all duration-300"
              onClick={handleSignIn}
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.8,
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
              Sign In
            </motion.button>
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Link
                href={"/forget-password"}
                className="text-[12px] text-custom-purple italic hover:underline hover:text-custom-rose transition-colors duration-300"
              >
                Forget your password?
              </Link>
              <div>
                <p className="text-[12px] mt-1">
                  Don&apos;t have an account?
                  <Link
                    href={"/signup"}
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

export default SignInPage;
