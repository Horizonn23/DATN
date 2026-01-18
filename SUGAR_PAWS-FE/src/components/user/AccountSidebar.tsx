"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUser,
  FaBell,
  FaLock,
  FaMapMarkerAlt,
  FaCreditCard,
  FaKey,
  FaClipboardList,
  FaTicketAlt,
  FaEdit,
} from "react-icons/fa";
import { useAppSelector } from "@/store/store";
import { selectName } from "@/store/slices/userSlice";

const sidebarItems = [
  { label: "Profile", icon: <FaUser />, href: "/user/account/profile" },
  { label: "Bank", icon: <FaCreditCard />, href: "/user/account/bank" },
  { label: "Address", icon: <FaMapMarkerAlt />, href: "/user/account/address" },
  {
    label: "Change Password",
    icon: <FaKey />,
    href: "/user/account/change-password",
  },
  {
    label: "Notification Settings",
    icon: <FaBell />,
    href: "/user/account/notification",
  },
  {
    label: "Privacy Settings",
    icon: <FaLock />,
    href: "/user/account/privacy",
  },
  { label: "Orders", icon: <FaClipboardList />, href: "/user/orders" },
  {
    label: "Voucher Wallet",
    icon: <FaTicketAlt />,
    href: "/user/account/voucher",
  },
];

const AccountSidebar = () => {
  const pathname = usePathname();
  const name = useAppSelector(selectName);
  return (
    <aside className="w-full max-w-xs md:w-64 bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col gap-2 mx-auto md:mx-0 md:sticky md:top-24 z-20 border border-pink-100">
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-100 to-pink-200 border-4 border-custom-wine flex items-center justify-center text-4xl text-custom-wine shadow mb-2">
          <FaUser />
        </div>
        <span className="font-bold text-lg md:text-xl text-center w-full flex justify-center text-custom-wine">
          {name}
        </span>
        <Link
          href="#"
          className="flex items-center gap-1 text-xs text-custom-wine hover:text-white hover:bg-custom-wine transition px-2 py-1 rounded mt-2 font-medium border border-custom-wine shadow-sm"
        >
          <FaEdit className="text-sm" />
          Edit Profile
        </Link>
      </div>
      <div className="border-t border-pink-100 mb-2" />
      <nav className="flex flex-col gap-1 w-full">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition font-semibold text-sm w-full border border-transparent hover:border-pink-200 hover:bg-pink-50 hover:shadow-sm group ${
              pathname?.includes(item.href)
                ? "bg-pink-100 text-custom-wine border-custom-wine shadow"
                : "text-gray-700"
            }`}
          >
            <span className="text-lg shrink-0 group-hover:scale-110 transition-transform duration-150 text-custom-wine">
              {item.icon}
            </span>
            <span className="truncate group-hover:text-custom-wine">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AccountSidebar;
