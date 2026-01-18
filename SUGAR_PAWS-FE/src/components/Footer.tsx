import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <>
      <div className="relative w-full h-[120px] bg-transparent text-custom-pink overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64 C480,192 960,0 1440,128 L1440,150 L0,150 Z"
          ></path>
        </svg>
      </div>
      <div className="bg-custom-pink w-full min-h-[400px] text-custom-purple font-light text-[10px] leading-5 pt-10">
        <div className="max-w-[1200px] min-w-[928px] w-[60%] flex justify-between m-auto gap-10">
          <div className="max-w-[360px] w-[25%] min-w-[200px]">
            <p>Search</p>
            <p>About us</p>
            <p>FAQ</p>
            <p>Shipping</p>
            <p>Privacy Policy</p>
            <p>Term of use</p>
            <p>Downloads</p>
            <p>Do not share or sale my personal information</p>
          </div>
          <div className="max-w-[360px] w-[25%] min-w-[200px]">
            <h6 className="font-semibold mb-1">About Sugar Paws</h6>
            <p>
              Specializing in J-Fashion, LC carries and supports indie designers
              and brands from around the world.
            </p>
            <h6 className="font-semibold my-1">Need Help with an Order</h6>
            <p>Contact us at sugarpaws@gmail.com</p>
          </div>
          <div className="max-w-[360px] w-[25%] min-w-[200px]">
            <h6 className="font-semibold mb-1">Newsletter</h6>
            <p>
              Stay up to date with new releases, products and exclusive offers.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Your email"
                className="w-full mt-3 bg-transparent border-[1px] border-custom-purple h-[30px] rounded-full px-4 placeholder-custom-purple"
              />
              <FontAwesomeIcon
                icon={faChevronRight}
                size="xl"
                className="absolute right-5 top-1/2 -translate-y-0.5 text-custom-purple cursor-pointer transition-all duration-300 hover:translate-x-[10px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
