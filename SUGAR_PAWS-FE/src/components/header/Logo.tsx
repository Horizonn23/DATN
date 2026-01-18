"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  isScrolled: boolean;
}

const Logo: React.FC<LogoProps> = ({ isScrolled }) => {
  return (
    <Link href="/" className="flex items-center gap-2 hover:text-custom-rose">
      <span
        className={`font-jua ${
          isScrolled ? "text-[32px]" : "text-[40px]"
        } z-20 font-medium text-transparent bg-gradient-to-b 
        from-custom-rose to-pink-500 bg-clip-text hover:text-custom-rose`}
      >
        Sugar Paws
      </span>
      <Image
        src="/assets/favicon/sugar-paws-logo.png"
        alt="Sugar Paws logo"
        height={isScrolled ? 40 : 50}
        width={isScrolled ? 32 : 40}
        className="w-auto z-20"
      />
    </Link>
  );
};

export default Logo;
