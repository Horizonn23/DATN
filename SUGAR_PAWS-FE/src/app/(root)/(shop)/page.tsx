"use client";

import Slider from "@/components/Slider";
import {
  faCircleCheck,
  faHeart,
  faStar,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";
import InfiniteCarousel from "@/components/InfiniteCarousel";
import FooterButtonList from "@/components/FooterButtonList";
import InstantShipping from "./InstantShipping";
import PlusSize from "./PlusSize";
import Link from "next/link";

type PopularItem = { imgSrc: string; name: string; linkTo?: string };

const cards = [
  {
    title: "Upcomming Events",
    description: "Catch us at a pop-up shop near you.",
    image: "/assets/images/featured-directory/img1.png",
  },
  {
    title: "Featured Designers",
    description: "See what inspires artists from around the world.",
    image: "/assets/images/featured-directory/img2.png",
  },
  {
    title: "The LC Team",
    description: "Get acquainted with LC.",
    image: "/assets/images/featured-directory/img3.png",
  },
  {
    title: "Our newsletter",
    description: "Community happenings.",
    image: "/assets/images/featured-directory/img4.png",
  },
];

export default function HomePage() {
  const popularItems: PopularItem[] = [
    {
      imgSrc: "/assets/images/popular-img/blouse.png",
      name: "Blouses",
      linkTo: "/clothing/blouses",
    },
    {
      imgSrc: "/assets/images/popular-img/skirt.png",
      name: "Jumperskirts",
      linkTo: "/clothing/jumperskirts",
    },
    {
      imgSrc: "/assets/images/popular-img/shoes.png",
      name: "Shoes",
      linkTo: "/accesories/shoes",
    },
    {
      imgSrc: "/assets/images/popular-img/sock.png",
      name: "Socks",
      linkTo: "/clothing/socks",
    },
    {
      imgSrc: "/assets/images/popular-img/hair.png",
      name: "Hair Accessories",
      linkTo: "/hair/hair-accessories",
    },
    {
      imgSrc: "/assets/images/popular-img/enamel-pins.png",
      name: "Enamel Pins",
      linkTo: "/accesories/enamel-pins",
    },
    {
      imgSrc: "/assets/images/popular-img/ring.png",
      name: "Rings",
      linkTo: "/jewelry/rings",
    },
    {
      imgSrc: "/assets/images/popular-img/necklaces.png",
      name: "Necklaces",
      linkTo: "/jewelry/necklaces",
    },
    {
      imgSrc: "/assets/images/popular-img/hair-clip.png",
      name: "Hair Clips",
      linkTo: "/hair/hair-clips",
    },
    {
      imgSrc: "/assets/images/popular-img/earing.png",
      name: "Earings",
      linkTo: "/jewelry/earings",
    },
  ];

  return (
    <div>
      <Slider />
      <div className="text-center text-[12px] h-8 bg-custom-rose py-2">
        NOW SHIPPING ALL VIETNAM - 7 days free return!
      </div>
      <section className="w-full py-12">
        <div className="max-w-[1200px] min-w-[928px] w-[60%] flex flex-col gap-10 m-auto">
          <h2 className="text-center text-[40px] font-bold ">POPULAR ITEMS</h2>
          <div className="flex flex-col gap-16">
            {Array.from({ length: Math.ceil(popularItems.length / 5) }).map(
              (_, rowIndex) => (
                <div key={rowIndex} className="flex justify-between">
                  {popularItems
                    .slice(rowIndex * 5, (rowIndex + 1) * 5)
                    .map((item, index) => {
                      const content = (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-6 cursor-pointer group"
                        >
                          <div className="w-[160px] h-[160px] rounded-full overflow-hidden transition-transform duration-700 group-hover:scale-110">
                            <Image
                              width={160}
                              height={160}
                              src={item.imgSrc}
                              alt={item.name}
                              className="object-cover"
                            />
                          </div>
                          <span className="text-[16px] font-bold transition-all duration-500 group-hover:tracking-wider">
                            {item.name}
                          </span>
                        </div>
                      );
                      return item.linkTo ? (
                        <Link href={item.linkTo} key={index} legacyBehavior>
                          {content}
                        </Link>
                      ) : (
                        content
                      );
                    })}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="w-full bg-custom-pink text-custom-purple">
        <div className="max-w-[1200px] min-w-[928px] w-[60%] flex justify-between items-center gap-10 m-auto min-h-[180px]">
          <div className="flex flex-col gap-2 justify-center items-center">
            <FontAwesomeIcon size="lg" icon={faStar} className="mb-1" />
            <h6 className="font-medium text-[16px]">Hanoi - Based</h6>
            <p className="text-[12px]">
              Our store is located in Hanoi, Vietnam
            </p>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <FontAwesomeIcon size="lg" icon={faCircleCheck} className="mb-1" />
            <h6 className="font-medium text-[16px]">Hassle-Free Returns</h6>
            <p className="text-[12px]">within 7 days</p>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <FontAwesomeIcon size="lg" icon={faHeart} className="mb-1" />
            <h6 className="font-medium text-[16px]">Independent Designers</h6>
            <p className="text-[12px]">
              Supporting creators all over the world
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-12">
        <h2 className="text-center text-[40px] font-bold">OUR BRANDS</h2>
        <InfiniteCarousel />
      </section>

      <section className="min-h-[536px] w-full text-custom-purple bg-custom-pink py-10 flex justify-center">
        <div className="max-w-[1200px] min-w-[928px] w-[60%] flex justify-between items-center gap-10">
          <div className="w-[50%] h-[460px] rounded-[16px] overflow-hidden relative">
            <Image
              src="/assets/images/retail-store.png"
              alt="Retail Store"
              fill
              sizes="(max-width: 928px) 50vw, (max-width: 1200px) 30vw, 360px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-6 px-4">
            <p className="text-[20px]">OUR RETAIL STORE</p>
            <h2 className="text-[32px] font-bold">Location & Hours</h2>
            <div className="mt-4 text-[12px]">
              <p className="leading-relaxed">Thursday - Sunday: 11 am - 7 pm</p>
              <p className="leading-relaxed">Monday & Tuesday: closed</p>
              <p className="leading-relaxed">Wednesday: by appointment only</p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-[536px] w-full  py-12 flex justify-center">
        <PlusSize />
      </section>

      <section className="min-h-[476px] w-full bg-custom-pink py-10 flex justify-center">
        <div className="max-w-[1200px] min-w-[928px] w-[60%] flex justify-between items-center gap-10">
          <div className="w-[42%] h-[379px] relative">
            <div className="w-[328px] h-[379px] relative rounded-[10px] overflow-hidden">
              <Image
                src="/assets/images/high-laced.png"
                alt="Retail Store"
                fill
                sizes="(max-width: 928px) 42vw, (max-width: 1200px) 25vw, 328px"
                className="object-cover"
              />
            </div>
            <Image
              src="/assets/images/high-laced.png"
              alt="Retail Store"
              width={238}
              height={230}
              className="rounded-[10px] h-auto absolute right-0 top-1/2 transform -translate-y-1/2"
            />
            <svg
              className="w-64 h-64 animate-spin-slow absolute -top-28 -left-32"
              viewBox="0 0 250 250"
            >
              <defs>
                <path
                  id="circlePath"
                  d="M 125, 125
                     m -60, 0
                     a 60,60 0 1,1 130,0
                     a 60,60 0 1,1 -130,0"
                />
              </defs>
              <text
                className="fill-custom-rose font-bold text-2xl tracking-widest"
                stroke="white"
                strokeWidth="2"
                paintOrder="stroke fill"
              >
                <textPath href="#circlePath" startOffset="15%">
                  ~INSTANT SHIPPING~
                </textPath>
              </text>
            </svg>
          </div>
          <InstantShipping />
        </div>
      </section>

      <section className="w-full py-10">
        <div className="max-w-[1200px] min-w-[928px] w-[60%] m-auto grid gap-4 p-6">
          <div className="grid grid-cols-[2fr_1fr] gap-4 h-[226px]">
            {cards.slice(0, 2).map((card, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes={
                    index === 0
                      ? "(max-width: 928px) 60vw, (max-width: 1200px) 40vw, 480px"
                      : "(max-width: 928px) 30vw, (max-width: 1200px) 20vw, 240px"
                  }
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
                  <h2 className="text-[32px] font-bold">{card.title}</h2>
                  <p className="text-[12px] mt-1">{card.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_2fr] gap-4 h-[226px]">
            {cards.slice(2, 4).map((card, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes={
                    index === 0
                      ? "(max-width: 928px) 30vw, (max-width: 1200px) 20vw, 240px"
                      : "(max-width: 928px) 60vw, (max-width: 1200px) 40vw, 480px"
                  }
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
                  <h2 className="text-[32px] font-bold">{card.title}</h2>
                  <p className="text-[12px] mt-1">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="relative w-full h-[380px]">
        <div className="relative w-full h-[490px]">
          <Image
            src="/assets/images/footer-img.png"
            alt="footer-bg"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="z-10 absolute top-72 max-w-[1200px] min-w-[928px] w-[60%] left-1/2 transform -translate-x-1/2 h-full flex justify-between gap-10 items-start text-white">
          <FooterButtonList />
        </div>
      </div>
    </div>
  );
}
