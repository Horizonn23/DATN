"use client";
import React from "react";
import Link from "next/link";
import {
  FiUser,
  FiShoppingBag,
  FiLogOut,
  FiUserCheck,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { removeUser } from "@/store/slices/userSlice";
import { clearStorage } from "@/helper/storage";
import { deselectAll } from "@/store/slices/cartSlice";

interface User {
  username: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
}

interface UserDropdownProps {
  userInfo: User | null;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userInfo }) => {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    clearStorage();
    dispatch(removeUser());
    // Clear cart data when signing out
    dispatch(deselectAll());
    router.push("/signin");
  };

  return (
    <div className="relative group h-full px-5 group">
      <div className="flex h-full items-center cursor-pointer group-hover:text-custom-rose">
        <FiUser
          size={20}
          className={`${pathname.includes("/user") ? "text-custom-rose" : ""}`}
        />
        {userInfo && userInfo.username && (
          <span
            className={`ml-2 text-[14px] ${pathname.includes("/user") ? "text-custom-rose" : ""}`}
          >
            {userInfo.name}
          </span>
        )}
      </div>
      <div
        className="absolute top-full right-0 bg-custom-yellow rounded-b-md shadow-xl group-hover:flex group-hover:flex-col 
        overflow-hidden text-[12px] w-[180px] h-0 group-hover:h-auto group-hover:scale-y-100 origin-top
        transform -translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-in-out 
        opacity-0 group-hover:opacity-100 scale-y-95 z-50"
      >
        {userInfo && userInfo.username ? (
          // Logged in dropdown options
          <>
            <Link
              href="/user/account/profile"
              className="hover:text-custom-rose hover:font-semibold hover:bg-custom-pink py-3 px-5 whitespace-nowrap text-[14px] flex items-center"
            >
              <FiUserCheck className="mr-3 text-[18px]" />
              My Account
            </Link>
            <Link
              href="/user/orders"
              className="hover:text-custom-rose hover:font-semibold hover:bg-custom-pink py-3 px-5 whitespace-nowrap text-[14px] flex items-center"
            >
              <FiShoppingBag className="mr-3 text-[18px]" />
              Orders
            </Link>
            <button
              onClick={handleSignOut}
              className="text-left hover:text-custom-rose hover:font-semibold hover:bg-custom-pink py-3 px-5 whitespace-nowrap text-[14px] flex items-center w-full"
            >
              <FiLogOut className="mr-3 text-[18px]" />
              Sign Out
            </button>
          </>
        ) : (
          // Logged out dropdown options
          <>
            <Link
              href="/signin"
              className="hover:text-custom-rose hover:font-semibold hover:bg-custom-pink py-3 px-5 whitespace-nowrap text-[14px] flex items-center"
            >
              <FiLogIn className="mr-3 text-[18px]" />
              Sign In
            </Link>
            <Link
              href="/signup"
              className="hover:text-custom-rose hover:font-semibold hover:bg-custom-pink py-3 px-5 whitespace-nowrap text-[14px] flex items-center"
            >
              <FiUserPlus className="mr-3 text-[18px]" />
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDropdown;
