import Image from "next/image";
import React from "react";

const AboutUsPage = () => {
  return (
    <main>
      <div className="w-full h-[140px] bg-custom-pink font-semibold text-[40px] flex items-center justify-center">
        About Us
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-20 pt-20 text-[12px]">
        <div className="w-[60%] max-w-[1200px] min-w-[928px] flex justify-between items-center">
          <div className="w-1/2 min-h-[340px] relative rounded-[10px] overflow-hidden">
            <Image
              src="/assets/images/about/our-story.png"
              alt="Our Story Image"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="w-[40%] text-center">
            <h1 className="font-semibold text-[32px] text-custom-purple mb-3">
              Our Story
            </h1>
            <p className="font-light">
              <strong className="font-semibold">Lolita Collective</strong> was
              created by a group of Hanoi Midwest-based designers in 2013 as a
              way to sell their hand-crafted items together at conventions.
            </p>
            <p className="font-light">
              With time, the concept has expanded to include over 80 indie
              designers and clothing producers from all over the world. You can
              shop our collection of Lolita and Japanese streetfashion style
              clothing and accessories here online, online, our retail store
              location, or at an event near you.
            </p>
          </div>
        </div>

        <div className="w-[60%] max-w-[1200px] min-w-[928px] flex justify-between items-center">
          <div className="w-[40%] text-center">
            <h1 className="font-semibold text-[32px] text-custom-purple mb-3">
              Lolita & Japanese Street Fashion
            </h1>
            <p className="font-light">
              Lolita is a street fashion inspired by Victorian and Rococo era
              style.Originating from Japan, lolita fashion has spread worldwide
              and has many substyles: sweet, gothic, classic, and more.
            </p>
            <p className="font-light">
              Our collection features items that can fit a range of styles so
              anyone can put together a unique look they love.
            </p>
            <p className="font-light">
              As with any place, there are many styles of street fashion in
              Japan. Some of these styles are extreme and avant-garde, while
              some are more tame. &quot;Street Fashion&ldquo; as a concept to be
              monitored was originally brought to importance by Fruits magazine.
              This magazine took snapshots of outfits and trends on Japanese
              streets. Though the styles have changed over the years, street
              fashion is still prominent in Tokyo today. Many different styles
              fit into the general &quot;Japanese Street Fashion&ldquo;
              category.
            </p>
          </div>
          <div className="w-1/2 min-h-[450px] overflow-hidden relative">
            <Image
              src="/assets/images/about/about-2.png"
              alt="About Image"
              width={315}
              height={380}
              className="rounded-[10px] absolute z-20 left-0 bottom-0"
            />
            <Image
              src="/assets/images/about/about-3.png"
              alt="About Image"
              width={314}
              height={330}
              className="rounded-[10px] absolute z-10 right-0 top-0"
            />
          </div>
        </div>

        <div className="w-[40%] max-w-[1000px] min-w-[650px] flex flex-col justify-center items-center text-center">
          <h1 className="font-semibold text-[32px] text-custom-purple mb-3">
            Hanoi-based, with items <br></br>from around the world
          </h1>
          <p className="font-light">
            Lolita is a street fashion inspired by Victorian and Rococo era
            style.
          </p>
          <p className="font-light">
            Originating from Japan, lolita fashion has spread worldwide and has
            many substyles: sweet, gothic, classic, and more.
          </p>
          <p className="font-light">
            Our collection features items that can fit a range of styles so
            anyone can put together a unique look they love.
          </p>
          <p className="font-light">
            As with any place, there are many styles of street fashion in Japan.
            Some of these styles are extreme and avant-garde, while some are
            more tame. &quot;Street Fashion&ldquo; as a concept to be monitored
            was originally brought to importance by Fruits magazine. This
            magazine took snapshots of outfits and trends on Japanese streets.
            Though the styles have changed over the years, street fashion is
            still prominent in Tokyo today. Many different styles fit into the
            general &quot;Japanese Street Fashion&ldquo; category.
          </p>
          <p className="font-light">
            The Lolita Collective focuses on lolita style but also includes
            otome, l&apos;arme, and decora among others.
          </p>
          <Image
            alt="About Image"
            width={457}
            height={241}
            src="/assets/images/about/about-4.png"
            className="rounded-[10px] my-6"
          />
          <h1 className="font-semibold text-[32px] text-custom-purple mb-3">
            Shop Online, In Store, or at an <br></br> Event Near You
          </h1>
          <p className="font-light">
            Check out our Events Page for information on what conventions we
            will be at next!
          </p>
        </div>

        <div className="w-[60%] max-w-[1200px] min-w-[928px] flex justify-between items-center">
          <div className="flex flex-col gap-6 px-4">
            <p className="text-[20px]">OUR RETAIL STORE</p>
            <h2 className="text-[32px] font-bold text-custom-purple">
              Location & Hours
            </h2>
            <div className="mt-4 text-[12px] font-light leading-relaxed">
              <p className="font-semibold text-custom-purple">
                880 NW Blue Parkway Suite C, Lee&apos;s Summit, Missouri 64086
              </p>
              <p>Thursday - Sunday: 11 am - 7 pm</p>
              <p>Monday & Tuesday: closed</p>
              <p>Wednesday: by appointment only</p>
            </div>
          </div>
          <div className="w-[50%] h-[457px] rounded-[16px] overflow-hidden relative">
            <Image
              src="/assets/images/about/about-5.png"
              alt="Retail Store"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutUsPage;
