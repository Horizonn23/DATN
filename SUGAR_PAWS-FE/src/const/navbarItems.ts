type NavBarItem = {
  name: string;
  link: string;
  nestedItems?: NestedNavBarItem[];
};

type NestedNavBarItem = {
  imageSrc?: string;
  titleItem?: { name: string; link: string };
  itemlist?: {
    name: string;
    link: string;
  }[];
};

export const navbarItems: NavBarItem[] = [
  {
    name: "ABOUT",
    link: "/about",
    nestedItems: [
      {
        itemlist: [
          { name: "about us", link: "/about" },
          { name: "retail localtion", link: "/retail-location" },
          { name: "faq's", link: "/faqs" },
          { name: "event calendar", link: "/event-calendar" },
          { name: "event booking", link: "/event-booking" },
        ],
      },
    ],
  },
  {
    name: "ACCESSORIES",
    link: "/accessories",
    nestedItems: [
      {
        imageSrc: "/assets/images/accessories/access-1.png",
        titleItem: {
          name: "accessories",
          link: "/accessories",
        },
        itemlist: [
          { name: "GLOVES", link: "/accessories/gloves" },
          {
            name: "harnesses and belts",
            link: "/accessories/harnesses-and-belts",
          },
          { name: "LASHES", link: "/accessories/lashes" },
          { name: "NECKWEARS", link: "/accessories/neckwears" },
          { name: "PARASOLS", link: "/accessories/parasols" },
          { name: "WRIRSTCUFFS", link: "/accessories/wrirstcuffs" },
          { name: "⭐ ALL ACCESSORIES ⭐", link: "/accessories" },
        ],
      },
      {
        titleItem: {
          name: "bags",
          link: "/accessories/bags",
        },
        imageSrc: "/assets/images/accessories/access-2.png",
        itemlist: [
          { name: "purses", link: "/accessories/" },
          { name: "make up bags", link: "/accessories/make-up-bags" },
          { name: "totes", link: "/accessories/totes" },
          { name: "wallets", link: "/accessories/wallets" },
          { name: "⭐ ALL BAGS ⭐", link: "/accessories/bags" },
        ],
      },
      {
        titleItem: {
          name: "PINS AND PATCHES",
          link: "/accessories/pins-and-patches",
        },
        imageSrc: "/assets/images/accessories/access-3.png",
        itemlist: [
          { name: "brooches", link: "/accessories/brooches" },
          { name: "buttons", link: "/accesories/buttons" },
          { name: "enamel pins", link: "/accessories/enamel-pins" },
          { name: "patches", link: "/accessories/patches" },
          {
            name: "⭐ ALL PINS & PATHCHES ⭐",
            link: "/accessories/pins-patches",
          },
        ],
      },
      {
        imageSrc: "/assets/images/accessories/access-4.png",
        titleItem: {
          name: "SHOES",
          link: "/accessories/shoes",
        },
        itemlist: [
          { name: "flats", link: "/accessories/flats" },
          { name: "heels", link: "/accessories/heels" },
          { name: "platforms", link: "/accessories/platforms" },
          { name: "⭐ ALL SHOES ⭐", link: "/accessories/shoes" },
        ],
      },
    ],
  },
  {
    name: "HAIR",
    link: "/hair",
    nestedItems: [
      {
        imageSrc: "/assets/images/hair/hair-1.png",
        titleItem: {
          name: "hair accessories",
          link: "/hair",
        },
        itemlist: [
          { name: "hair claws", link: "/hair/claws" },
          { name: "hair cups", link: "/hair/cups" },
          { name: "scrunchies", link: "/hair/scrunchies" },
          { name: "hair clips", link: "/hair/hair-clips" },
          { name: "⭐ ALL hair ACCESSORIES ⭐", link: "/hair" },
        ],
      },
      {
        titleItem: {
          name: "hats",
          link: "/hair/hats",
        },
        imageSrc: "/assets/images/hair/hair-2.png",
        itemlist: [
          { name: "berets", link: "/hair/berets" },
          { name: "bonnets", link: "/hair/bonnets" },
          { name: "crowns", link: "/hair/crowns" },
          { name: "⭐ ALL hats ⭐", link: "/hair/hats" },
        ],
      },
      {
        titleItem: {
          name: "headbands & hairbows",
          link: "/hair/headbands-hairbows",
        },
        imageSrc: "/assets/images/hair/hair-3.png",
        itemlist: [
          { name: "halos", link: "/hair/halos" },
          { name: "headbands", link: "/accesories/headbands" },
          { name: "hairbows", link: "/hair/hairbows" },
          { name: "headdresses", link: "/hair/headdress" },
          {
            name: "⭐ ALL headbands & hairbows ⭐",
            link: "/hair/headbands-hairbows",
          },
        ],
      },
    ],
  },
  {
    name: "CLOTHING",
    link: "/clothing",
    nestedItems: [
      {
        imageSrc: "/assets/images/clothing/clothing-1.png",
        titleItem: {
          name: "TOPS",
          link: "/clothing/tops",
        },
        itemlist: [
          { name: "blouses", link: "/clothing/blouses" },
          { name: "button up shirts", link: "/clothing/button-up-shirts" },
          { name: "cardigans", link: "/clothing/cardigans" },
          { name: "cutsews", link: "/clothing/cutsews" },
          { name: "sweaters", link: "/clothing/sweaters" },
          { name: "t-shirts", link: "/clothing/tshirts" },
          { name: "⭐ ALL tops ⭐", link: "/clothing/tops" },
        ],
      },
      {
        titleItem: {
          name: "dresses",
          link: "/clothing/dresses",
        },
        imageSrc: "/assets/images/clothing/clothing-2.png",
        itemlist: [
          { name: "aprons", link: "/clothing/aprons" },
          { name: "jumperskirts", link: "/clothing/jumperskirts" },
          { name: "onepieces", link: "/clothing/onepieces" },
          { name: "⭐ ALL dresses ⭐", link: "/clothing/dresses" },
        ],
      },
      {
        titleItem: {
          name: "bottoms",
          link: "/clothing/bottoms",
        },
        imageSrc: "/assets/images/clothing/clothing-3.png",
        itemlist: [
          { name: "skirts", link: "/clothing/skirts" },
          { name: "petticoats", link: "/clothing/petticoats" },
          { name: "bloomers", link: "/clothing/bloomers" },
          { name: "shorts & pants", link: "/clothing/shorts" },
          { name: "sweetpants", link: "/clothing/sweetpants" },
          {
            name: "⭐ ALL bottoms ⭐",
            link: "/clothing/dresses",
          },
        ],
      },
      {
        imageSrc: "/assets/images/clothing/clothing-4.png",
        titleItem: {
          name: "legwears",
          link: "/clothing/legwears",
        },
        itemlist: [
          { name: "leggings", link: "/clothing/leggings" },
          { name: "socks", link: "/clothing/socks" },
          { name: "tights", link: "/clothing/tights" },
          { name: "⭐ ALL legwears ⭐", link: "/clothing/legwears" },
        ],
      },
      {
        imageSrc: "/assets/images/clothing/clothing-5.png",
        titleItem: {
          name: "swimwears",
          link: "/clothing/swimwears",
        },
      },
    ],
  },
  {
    name: "JEWELRY",
    link: "/jewelry",
    nestedItems: [
      {
        imageSrc: "/assets/images/jewelry/jewelry-1.png",
        titleItem: {
          name: "bracelets",
          link: "/jewelry/bracelets",
        },
        itemlist: [
          { name: "bracelets", link: "/jewelry/bracelets" },
          { name: "wrirstcuffs", link: "/jewelry/wrirstcuffs" },
          { name: "⭐ ALL bracelets ⭐", link: "/jewelry/bracelets" },
        ],
      },
      {
        titleItem: {
          name: "earings",
          link: "/jewelry/earings",
        },
        imageSrc: "/assets/images/jewelry/jewelry-2.png",
        itemlist: [
          { name: "hanging earings", link: "/jewelry/hanging-earings" },
          { name: "stud earings", link: "/jewelry/stud-earings" },
          { name: "cup on earings", link: "/jewelry/cup-on-earings" },
          { name: "⭐ ALL earings ⭐", link: "/jewelry/earings" },
        ],
      },
      {
        titleItem: {
          name: "flairs",
          link: "/jewelry/flairs",
        },
        imageSrc: "/assets/images/jewelry/jewelry-3.png",
        itemlist: [
          { name: "brooches", link: "/jewelry/brooches" },
          { name: "buttons", link: "/accesories/buttons" },
          { name: "enamel pins", link: "/jewelry/enamel-pins" },
          { name: "rosettes", link: "/jewelry/rosettes" },
          {
            name: "⭐ ALL flairs ⭐",
            link: "/jewelry/flairs",
          },
        ],
      },
      {
        imageSrc: "/assets/images/jewelry/jewelry-4.png",
        titleItem: {
          name: "necklaces",
          link: "/jewelry/necklaces",
        },
        itemlist: [
          { name: "chockers and collars", link: "/jewelry/chockers-collars" },
          { name: "long necklaces", link: "/jewelry/long-necklaces" },
          { name: "⭐ ALL necklaces ⭐", link: "/jewelry/necklaces" },
        ],
      },
      {
        imageSrc: "/assets/images/jewelry/jewelry-5.png",
        titleItem: {
          name: "rings",
          link: "/jewelry/rings",
        },
      },
    ],
  },
  {
    name: "PLUS SIZE",
    link: "/plus-size",
    nestedItems: [
      {
        itemlist: [
          { name: "plus size dresses", link: "/plus-size/plus-size-dresses" },
          { name: "plus size skirts", link: "/plus-size/plus-size-skirts" },
          { name: "plus size blouses", link: "/plus-size/plus-size-blouses" },
          { name: "plus size casual", link: "/plus-size/plus-size-casual" },
          {
            name: "plus size petticoat & bloomers",
            link: "/plus-size/plus-size-petticoat-bloomers",
          },
          { name: "⭐ all plus size clothing ⭐", link: "/plus-size" },
        ],
      },
    ],
  },
  // { name: "BRAND", link: "/brand" },
];
