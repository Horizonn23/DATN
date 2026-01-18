"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  link: string;
  nestedItems?: {
    imageSrc?: string;
    titleItem?: {
      name: string;
      link: string;
    };
    itemlist?: {
      name: string;
      link: string;
    }[];
  }[];
}

interface NavigationMenuProps {
  navbarItems: NavItem[];
  isScrolled: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  navbarItems,
  isScrolled,
}) => {
  const pathname = usePathname() ?? "";

  return (
    <ul className="flex h-full">
      {navbarItems.map((item) => {
        const isActive =
          pathname === item.link || pathname.startsWith(`${item.link}/`);
        return (
          <li key={item.name} className="h-full px-4 relative group">
            <Link
              href={item.link}
              className={`z-20 relative flex items-center h-full text-[13px] tracking-wider after:content-[''] after:absolute after:w-full 
                after:h-[1px] after:bg-black after:left-0 after:bottom-4 after:transition-transform after:duration-300 ${
                  isActive ? "after:scale-x-100" : "after:scale-x-0"
                } group-hover:after:scale-x-100`}
            >
              {item.name}
            </Link>

            {item.nestedItems?.length && item.nestedItems.length > 1 && (
              <div
                className={`fixed ${
                  isScrolled ? "top-[52px]" : "top-[72px]"
                } w-[100vw] gap-10 items-stretch left-0 bg-custom-yellow shadow-xl z-50 
                  group-hover:flex overflow-hidden text-[12px] ${
                    item.nestedItems.length === 3 ? "px-[20%]" : "px-[10%]"
                  } h-0 group-hover:h-auto 
                  transform -translate-y-5 group-hover:translate-y-0 transition-transform duration-500 ease-in-out group-hover:py-5
                  opacity-0 group-hover:opacity-100 scale-y-95 group-hover:scale-y-100 origin-top z-10 rounded-b-md`}
              >
                {item.nestedItems.map((subItem) => (
                  <div
                    key={subItem.imageSrc}
                    className="flex flex-1 flex-col items-start"
                  >
                    {subItem.titleItem && subItem.imageSrc && (
                      <Link
                        href={subItem.titleItem.link}
                        className="hover:text-custom-rose text-[16px] w-full hover:font-semibold uppercase py-2 whitespace-nowrap"
                      >
                        <div
                          className={`relative rounded-[10px] h-[140px] w-full overflow-hidden mb-3 z-10`}
                        >
                          <Image
                            src={subItem.imageSrc}
                            alt="access logo"
                            fill
                            sizes="(max-width: 768px) 100vw, 200px"
                            className="object-cover hover:scale-125 transition-all duration-500 z-10"
                          />
                        </div>
                        {subItem.titleItem.name}
                      </Link>
                    )}
                    {subItem.itemlist &&
                      subItem.itemlist.map((item, index) => (
                        <Link
                          href={item.link}
                          key={index}
                          className="hover:text-custom-rose w-full hover:font-semibold uppercase py-2 whitespace-nowrap"
                        >
                          {item.name}
                        </Link>
                      ))}
                  </div>
                ))}
              </div>
            )}

            {item.nestedItems?.length === 1 && (
              <div
                className="absolute top-full left-0 bg-custom-yellow rounded-b-md shadow-xl group-hover:flex group-hover:flex-col 
                  overflow-hidden text-[12px] w-auto h-0 group-hover:h-auto group-hover:scale-y-100 origin-top
                  transform -translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-in-out 
                  opacity-0 group-hover:opacity-100 scale-y-95"
              >
                {item.nestedItems[0].itemlist &&
                  item.nestedItems[0].itemlist.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.link}
                      className="hover:text-custom-rose hover:font-semibold hover:bg-custom-pink uppercase py-2 px-5 whitespace-nowrap"
                    >
                      {subItem.name}
                    </Link>
                  ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NavigationMenu;
